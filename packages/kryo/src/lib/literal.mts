import {writeError} from "./_helpers/context.mts";
import {lazyProperties} from "./_helpers/lazy-properties.mts";
import {CheckKind} from "./checks/check-kind.mts";
import type {LiteralTypeCheck} from "./checks/literal-type.mts";
import type {CheckId, ExtractType, IoType, KryoContext, Lazy, Reader, Result, Type, Writer} from "./index.mts";

export type Name = "Literal";
export const name: Name = "Literal";
export type Diff = unknown;

/**
 * T: Typescript type
 * K: Kryo type
 */
export interface LiteralTypeOptions<TyLiteral extends ExtractType<TyKryo>, TyKryo extends Type<unknown>> {
  type: TyKryo;
  value: TyLiteral;
}

export interface LiteralTypeConstructor {
  new<const TyLiteral extends ExtractType<TyKryo>, const TyKryo extends IoType<unknown> = IoType<unknown>>(options: Lazy<LiteralTypeOptions<TyLiteral, TyKryo>>): LiteralIoType<TyLiteral, TyKryo>;

  new<const TyLiteral extends ExtractType<TyKryo>, const TyKryo extends Type<unknown> = IoType<unknown>>(options: Lazy<LiteralTypeOptions<TyLiteral, TyKryo>>): LiteralType<TyLiteral, TyKryo>;
}

export interface LiteralType<TyLiteral extends ExtractType<TyKryo>, TyKryo extends Type<unknown> = Type<unknown>> extends Type<TyLiteral>, LiteralTypeOptions<TyLiteral, TyKryo> {
}

export interface LiteralIoType<TyLiteral extends ExtractType<TyKryo>, TyKryo extends IoType<unknown> = IoType<unknown>> extends IoType<TyLiteral>, LiteralType<TyLiteral, TyKryo> {
  read<R>(cx: KryoContext, reader: Reader<R>, raw: R): Result<TyLiteral, CheckId>;

  write<W>(writer: Writer<W>, value: TyLiteral): W;
}

/**
 * You may need to explicitly write the type or inference won't pick it.
 * For example, in the case of enum values, inference will pick the type of the enum instead of
 * the specific property you pass.
 */
export const LiteralType: LiteralTypeConstructor = class<const TyLiteral extends ExtractType<TyKryo>, TyKryo extends Type<unknown> = Type<unknown>> implements IoType<TyLiteral> {
  readonly name: Name = name;
  readonly type!: TyKryo;
  readonly value!: TyLiteral;

  private _options: Lazy<LiteralTypeOptions<TyLiteral, TyKryo>>;

  constructor(options: Lazy<LiteralTypeOptions<TyLiteral, TyKryo>>) {
    this._options = options;
    if (typeof options !== "function") {
      this._applyOptions();
    } else {
      lazyProperties(this, this._applyOptions, ["type", "value"]);
    }
  }

  read<R>(cx: KryoContext, reader: Reader<R>, raw: R): Result<TyLiteral, CheckId> {
    if (this.type.read === undefined) {
      throw new Error(`read is not supported for Literal with non-readable type ${this.type.name}`);
    }
    const res = this.type.read(cx, reader, raw);
    if (res.ok) {
      return this.test(cx, res.value);
    } else {
      return res;
    }
  }

  write<W>(writer: Writer<W>, value: TyLiteral): W {
    if (this.type.write === undefined) {
      throw new Error(`write is not supported for Literal with non-writable type ${this.type.name}`);
    }
    return this.type.write(writer, value);
  }

  test(cx: KryoContext | null, value: unknown): Result<TyLiteral, CheckId> {
    const {ok, value: actual} = this.type.test(cx, value);
    if (!ok) {
      return writeError(cx, {check: CheckKind.LiteralType, children: [actual]} satisfies LiteralTypeCheck);
    }
    if (!this.type.equals(actual, this.value)) {
      return writeError(cx, {check: CheckKind.LiteralValue});
    }
    return {ok: true, value: actual as TyLiteral};
  }

  equals(left: TyLiteral, right: TyLiteral): boolean {
    return this.type.equals(left, right);
  }

  lte(left: TyLiteral, right: TyLiteral): boolean {
    return this.type.lte!(left, right);
  }

  clone(val: TyLiteral): TyLiteral {
    return this.type.clone(val) as TyLiteral;
  }

  diff(_oldVal: TyLiteral, _newVal: TyLiteral): undefined {
    return;
  }

  patch(oldVal: TyLiteral, _diff: undefined): TyLiteral {
    return this.type.clone(oldVal) as TyLiteral;
  }

  reverseDiff(_diff: Diff | undefined): undefined {
    return;
  }

  squash(_diff1: undefined, _diff2: undefined): undefined {
    return;
  }

  private _applyOptions(): void {
    if (this._options === undefined) {
      throw new Error("missing `_options` for lazy initialization");
    }
    const options: LiteralTypeOptions<TyLiteral, TyKryo> = typeof this._options === "function"
      ? this._options()
      : this._options;

    const type: TyKryo = options.type;
    const value: TyLiteral = options.value;

    Object.assign(this, {type, value});
  }
};
