import {writeError} from "./_helpers/context.mts";
import {lazyProperties} from "./_helpers/lazy-properties.mts";
import {CheckKind} from "./checks/check-kind.mts";
import type {UnionMatchCheck} from "./checks/union-match.mts";
import type {UnionTagValueCheck} from "./checks/union-tag-value.mts";
import type {
  AnyKey,
  CheckId,
  IoType,
  KryoContext,
  Lazy,
  Reader,
  Result,
  TypedValue,
  VersionedType,
  Writer
} from "./index.mts";
import {NOOP_CONTEXT} from "./index.mts";
import {LiteralType} from "./literal.mts";
import {readVisitor} from "./readers/read-visitor.mts";
import {RecordType} from "./record.mts";
import {TsEnumType} from "./ts-enum.mts";

export type Name = "union";
export const name: Name = "union";
export type Diff = unknown;

export interface TaggedUnionTypeOptions<T, $T extends RecordType<T> = RecordType<T>> {
  variants: readonly $T[];
  tag: keyof T;
}

export type TestWithVariantResult<T> =
  [true, VersionedType<T, unknown>]
  | [false, VersionedType<T, unknown> | undefined];

/**
 * Represent a union T of record type M, where each record has key K with a unique value acting as a discriminant.
 *
 * This the runtime variant of TypeScript's discriminated unions.
 */
// <T, K extends keyof T, M extends (RecordType<T> & {properties: {[tag in K]: LiteralType<unknown> & {type: TsEnumType}}}
export class TaggedUnionType<T, M extends RecordType<T> = RecordType<T>>
implements IoType<T>, TaggedUnionTypeOptions<T, M> {
  readonly name: Name = name;
  readonly variants!: readonly M[];
  readonly tag!: keyof T;

  #valueToVariantMap!: Map<unknown, M>;
  #options?: Lazy<TaggedUnionTypeOptions<T, M>>;
  #outTag: string | undefined;
  #tagType: TsEnumType | undefined;


  constructor(options: Lazy<TaggedUnionTypeOptions<T, M>>) {
    this.#options = options;
    if (typeof options !== "function") {
      this.#applyOptions();
    } else {
      lazyProperties(
        this,
        this.#applyOptions,
        ["variants", "tag"],
      );
    }
  }

  match(cx: KryoContext | null, value: unknown): Result<M, CheckId> {
    if (typeof value !== "object" || value === null) {
      return writeError(cx, {check: CheckKind.BaseType, expected: ["Record"]});
    }
    const tag: keyof T = this.tag;
    const tagValue: unknown = Reflect.get(value, tag);
    if (tagValue === undefined) {
      return writeError(cx, {check: CheckKind.UnionTagPresent, tag: String(tag)});
    }
    const variantType: M | undefined = this.#valueToVariantMap.get(tagValue); // tagToVariant
    if (variantType === undefined) {
      return writeError(cx, {
        check: CheckKind.UnionTagValue,
        tag: String(this.tag),
        actual: String(tagValue),
        allowed: [...this.#valueToVariantMap.keys()].map((s) => String(s))
      } satisfies UnionTagValueCheck);
    }
    return {ok: true, value: variantType};
  }

  matchTrusted(value: T): M {
    const {ok, value: variantType} = this.match(NOOP_CONTEXT, value);
    if (!ok) {
      throw new Error("no matching variant found for `TaggedUnion` value");
    }
    return variantType;
  }

  write<W>(writer: Writer<W>, value: T): W {
    const variant: M = this.matchTrusted(value);
    if (variant.write === undefined) {
      throw new Error(`write is not supported for TaggedUnion with non-writable variant ${variant.name}`);
    }
    return variant.write(writer, value);
  }

  read<R>(cx: KryoContext, reader: Reader<R>, raw: R): Result<T, CheckId> {
    const {ok, value} = this.variantRead(cx, reader, raw);
    if (ok) {
      return {ok: true, value: value.value};
    } else {
      return {ok: false, value};
    }
  }

  variantRead<R>(cx: KryoContext, reader: Reader<R>, raw: R): Result<TypedValue<T, M>, CheckId> {
    return reader.readRecord(cx, raw, readVisitor({
      fromMap: <RK, RV>(
        input: Map<RK, RV>,
        keyReader: Reader<RK>,
        valueReader: Reader<RV>,
      ): Result<TypedValue<T, M>, CheckId> => {
        const outTag: string = this.#getOutTag();
        for (const [rawKey, rawValue] of input) {
          const {ok: okUnecheckedKey, value: outKey} = keyReader.readString(
            cx,
            rawKey,
            readVisitor({fromString: (value: string): Result<string, CheckId> => ({ok: true, value})}),
          );
          if (!okUnecheckedKey) {
            return writeError(cx, {check: CheckKind.PropertyKeyFormat, children: [outKey]});
          }
          if (outKey !== outTag) {
            continue;
          }
          const {ok: tagValueOk, value: tagValue} = this.#getTagType().read(cx, valueReader, rawValue);
          const variant: M | undefined = tagValueOk ? this.#valueToVariantMap.get(tagValue) : undefined; // tagToVariant
          if (variant === undefined) {
            return writeError(cx, {
              check: CheckKind.UnionTagValue,
              tag: String(this.tag),
              actual: String(tagValue),
              allowed: [...this.#valueToVariantMap.keys()].map((s) => String(s))
            } satisfies UnionTagValueCheck);
          }
          const {ok, value} = variant.read!(cx, reader, raw);
          if (!ok) {
            return writeError(cx, {check: CheckKind.UnionMatch, children: [value]} satisfies UnionMatchCheck);
          }
          return {ok: true, value: {type: variant, value}};
        }
        return writeError(cx, {check: CheckKind.UnionTagPresent, tag: String(this.tag)});
      },
    }));
  }

  test(cx: KryoContext | null, value: unknown): Result<T, CheckId> {
    if (typeof value !== "object" || value === null) {
      return writeError(cx, {check: CheckKind.BaseType, expected: ["Record"]});
    }
    const {ok, value: variantType} = this.match(cx, value);
    if (!ok) {
      return writeError(cx, {check: CheckKind.UnionMatch, children: [variantType]} satisfies UnionMatchCheck);
    }
    return variantType.test(cx, value);
  }

  equals(val1: T, val2: T): boolean {
    const type1: M = this.matchTrusted(val1);
    const type2: M = this.matchTrusted(val2);
    return type1 === type2 && type1.equals(val1, val2);
  }

  clone(val: T): T {
    return this.matchTrusted(val).clone(val);
  }

  #applyOptions(): void {
    if (this.#options === undefined) {
      throw new Error("missing `_options` for lazy initialization");
    }
    const options: TaggedUnionTypeOptions<T, M> = typeof this.#options === "function"
      ? this.#options()
      : this.#options;

    const variants: readonly M[] = options.variants;
    const tag: keyof T = options.tag;
    const tagValueToType: Map<unknown, M> = new Map();

    for (const variantType of variants) {
      const lit: LiteralType<AnyKey, TsEnumType> = variantType.properties[tag].type as unknown as LiteralType<AnyKey, TsEnumType>;
      if (tagValueToType.has(lit.value)) {
        throw new Error(`\`TaggedUnion\` tag value ${String(lit.value)} is is not unique`);
      }
      tagValueToType.set(lit.value, variantType);
    }

    this.#valueToVariantMap = tagValueToType;
    Object.assign(this, {variants, tag});
  }

  /**
   * Returns the serialized name of the tag property.
   *
   * The name is computed on-demand and cached. It is not computed in the constructor (or option application)
   * to avoid throwing if the type is not used for IO.
   */
  #getOutTag(): string {
    const tag = this.tag;
    if (this.#outTag === undefined) {
      let outTag: string | undefined = undefined;
      for (const variant of this.variants) {
        const cur: string = variant.getOutKey(tag);
        if (outTag === undefined) {
          outTag = cur;
        } else if (cur !== outTag) {
          throw new Error(`conflict for out key of the tag property: tag=${String(tag)}, firstOut=${cur}, secondOut=${outTag}`);
        }
      }
      if (outTag === undefined) {
        throw new Error("failed to find out key of the tag property");
      }
      this.#outTag = outTag;
    }
    return this.#outTag;
  }

  /**
   * Returns the type of the tag property.
   *
   * The type is computed on-demand and cached. It is not computed in the constructor (or option application)
   * to avoid throwing if the type is not used for IO.
   */
  #getTagType(): TsEnumType {
    if (this.#tagType === undefined) {
      const tag = this.tag;
      let tagType: TsEnumType | undefined = undefined;
      for (const variant of this.variants) {
        const lit: LiteralType<AnyKey, TsEnumType> = variant.properties[tag].type as unknown as LiteralType<AnyKey, TsEnumType>;
        const cur: TsEnumType = lit.type;
        if (tagType === undefined) {
          tagType = cur;
        } else if (cur !== tagType) {
          throw new Error("conflict for tag property type");
        }
      }
      if (tagType === undefined) {
        throw new Error("failed to find type of the tag property");
      }
      this.#tagType = tagType;
    }
    return this.#tagType;
  }
}
