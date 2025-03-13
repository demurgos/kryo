import {writeError} from "./_helpers/context.mts";
import {lazyProperties} from "./_helpers/lazy-properties.mts";
import {CheckKind} from "./checks/check-kind.mts";
import type {CheckId, ExtractType, IoType, KryoContext, Lazy, Reader, Result, VersionedType, Writer} from "./index.mts";

export type Name = "LiteralUnion";
export const name: Name = "LiteralUnion";
export type Diff = [number, number];

export interface LiteralUnionTypeOptions<T extends ExtractType<$T>, $T extends VersionedType<unknown, unknown>> {
  type: $T;
  values: T[];
}

/**
 * `TryUnion` of `Literal`; but where the base type is shared.
 */
export class LiteralUnionType<const T extends ExtractType<$T>, const $T extends VersionedType<unknown, unknown> = VersionedType<unknown, unknown>> implements IoType<T>, VersionedType<T, Diff> {
  readonly name: Name = name;
  readonly type!: $T;
  readonly values!: T[];

  #options: Lazy<LiteralUnionTypeOptions<T, $T>>;

  constructor(options: Lazy<LiteralUnionTypeOptions<T, $T>>) {
    this.#options = options;
    if (typeof options !== "function") {
      this.#applyOptions();
    } else {
      lazyProperties(this, this.#applyOptions, ["type", "values"]);
    }
  }

  read<R>(cx: KryoContext, reader: Reader<R>, raw: R): Result<T, CheckId> {
    if (this.type.read === undefined) {
      throw new Error(`read is not supported for LiteralUnion with non-readable type ${this.type.name}`);
    }
    const {ok, value} = this.type.read(cx, reader, raw);
    if (ok) {
      for (const allowed of this.values) {
        if (this.type.equals(value, allowed)) {
          return {ok: true, value: value as T};
        }
      }
      return writeError(cx, {check: CheckKind.LiteralValue});
    } else {
      return writeError(cx, {check: CheckKind.LiteralType, children: [value]});
    }
  }

  write<W>(writer: Writer<W>, value: T): W {
    if (this.type.write === undefined) {
      throw new Error(`write is not supported for LiteralUnion with non-writable type ${this.type.name}`);
    }
    return this.type.write(writer, value);
  }

  test(cx: KryoContext | null, value: unknown): Result<T, CheckId> {
    const {ok, value: actual} = this.type.test(cx, value);
    if (!ok) {
      return writeError(cx, {check: CheckKind.LiteralType, children: [actual]});
    }
    for (const allowed of this.values) {
      if (this.type.equals(actual, allowed)) {
        return {ok: true, value: actual as T};
      }
    }
    return writeError(cx, {check: CheckKind.LiteralValue});
  }

  equals(val1: T, val2: T): boolean {
    return this.type.equals(val1, val2);
  }

  clone(val: T): T {
    return this.type.clone(val) as T;
  }

  diff(oldVal: T, newVal: T): Diff | undefined {
    if (this.equals(newVal, oldVal)) {
      return undefined;
    }
    let oldIndex: number | undefined = undefined;
    let newIndex: number | undefined = undefined;
    for (const [i, allowed] of this.values.entries()) {
      if (oldIndex === undefined && this.type.equals(oldVal, allowed)) {
        oldIndex = i;
      }
      if (newIndex === undefined && this.type.equals(newVal, allowed)) {
        newIndex = i;
      }
      if (oldIndex !== undefined && newIndex !== undefined) {
        break;
      }
    }
    if (oldIndex === undefined || newIndex === undefined) {
      throw new Error("assertion error: `oldVal` and `newVal` should both be instances of the union type, but failed to retrieve index of the corresponding literal");
    }

    return [oldIndex, newIndex];
  }

  patch(oldVal: T, diff: Diff | undefined): T {
    return diff !== undefined ? this.type.clone(this.values[diff[1]]) as T : oldVal;
  }

  reverseDiff(diff: Diff | undefined): Diff | undefined {
    return diff !== undefined ? [diff[1], diff[0]] : undefined;
  }

  squash(diff1: Diff | undefined, diff2: Diff | undefined): Diff | undefined {
    if (diff1 === undefined) {
      return diff2;
    } else if (diff2 === undefined) {
      return diff1;
    } else {
      return [diff1[0], diff2[1]];
    }
  }

  #applyOptions(): void {
    if (this.#options === undefined) {
      throw new Error("missing `_options` for lazy initialization");
    }
    const options: LiteralUnionTypeOptions<T, $T> = typeof this.#options === "function" ? this.#options() : this.#options;

    const type: $T = options.type;
    const values: T[] = options.values;

    Object.assign(this, {type, values});
  }
}
