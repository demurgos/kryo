/**
 * @module kryo/readers/qs
 */

import type {CheckId, KryoContext, Reader, ReadVisitor, Result} from "kryo";
import {writeError} from "kryo";
import {CheckKind} from "kryo/checks/check-kind";
import type {PropertyKeyCheck} from "kryo/checks/property-key";
import qs, {type ParsedQs} from "qs";

import type {QsValue} from "./qs-value.mts";
import {QsValueReader} from "./qs-value-reader.mts";

export class QsReader implements Reader<string> {
  trustInput?: boolean | undefined;

  private readonly valueReader: QsValueReader;

  private readonly primitiveWrapper: string;

  constructor(trust?: boolean, primitiveWrapper: string = "_") {
    this.trustInput = trust;
    this.primitiveWrapper = primitiveWrapper;
    this.valueReader = new QsValueReader(trust);
  }

  readAny<T>(cx: KryoContext, raw: string, visitor: ReadVisitor<T>): Result<T, CheckId> {
    const wrapped = this.#readWrapped(cx, raw);
    if (!wrapped.ok) {
      return wrapped;
    }
    return this.valueReader.readAny(cx, wrapped.value, visitor);
  }

  readBoolean<T>(cx: KryoContext, raw: string, visitor: ReadVisitor<T>): Result<T, CheckId> {
    const wrapped = this.#readWrapped(cx, raw);
    if (!wrapped.ok) {
      return wrapped;
    }
    return this.valueReader.readBoolean(cx, wrapped.value, visitor);
  }

  readBytes<T>(cx: KryoContext, raw: string, visitor: ReadVisitor<T>): Result<T, CheckId> {
    const wrapped = this.#readWrapped(cx, raw);
    if (!wrapped.ok) {
      return wrapped;
    }
    return this.valueReader.readBytes(cx, wrapped.value, visitor);
  }

  readDate<T>(cx: KryoContext, raw: string, visitor: ReadVisitor<T>): Result<T, CheckId> {
    const wrapped = this.#readWrapped(cx, raw);
    if (!wrapped.ok) {
      return wrapped;
    }
    return this.valueReader.readDate(cx, wrapped.value, visitor);
  }

  readRecord<T>(cx: KryoContext, raw: string, visitor: ReadVisitor<T>): Result<T, CheckId> {
    return this.valueReader.readRecord(cx, qs.parse(raw), visitor);
  }

  readFloat64<T>(cx: KryoContext, raw: string, visitor: ReadVisitor<T>): Result<T, CheckId> {
    const wrapped = this.#readWrapped(cx, raw);
    if (!wrapped.ok) {
      return wrapped;
    }
    return this.valueReader.readFloat64(cx, wrapped.value, visitor);
  }

  readList<T>(cx: KryoContext, raw: string, visitor: ReadVisitor<T>): Result<T, CheckId> {
    const wrapped = this.#readWrapped(cx, raw);
    if (!wrapped.ok) {
      return wrapped;
    }
    return this.valueReader.readList(cx, wrapped.value, visitor);
  }

  readMap<T>(cx: KryoContext, raw: string, visitor: ReadVisitor<T>): Result<T, CheckId> {
    return this.valueReader.readMap(cx, qs.parse(raw), visitor);
  }

  readNull<T>(cx: KryoContext, raw: string, visitor: ReadVisitor<T>): Result<T, CheckId> {
    const wrapped = this.#readWrapped(cx, raw);
    if (!wrapped.ok) {
      return wrapped;
    }
    return this.valueReader.readNull(cx, wrapped.value, visitor);
  }

  readString<T>(cx: KryoContext, raw: string, visitor: ReadVisitor<T>): Result<T, CheckId> {
    const wrapped = this.#readWrapped(cx, raw);
    if (!wrapped.ok) {
      return wrapped;
    }
    return this.valueReader.readString(cx, wrapped.value, visitor);
  }

  #readWrapped(cx: KryoContext, raw: string): Result<QsValue, CheckId> {
    const wrapper: ParsedQs = qs.parse(raw);
    const wrapped = Reflect.get(wrapper, this.primitiveWrapper);
    const hasExtra = Reflect.ownKeys(wrapper).find(k => k !== this.primitiveWrapper) !== undefined;
    if (hasExtra || !(wrapped === undefined || typeof wrapped === "string" || Array.isArray(wrapped))) {
      return writeError(cx, {check: CheckKind.PropertyKey} satisfies PropertyKeyCheck);
    }
    return {ok: true, value: wrapped};
  }
}

export const QS_READER: QsReader = new QsReader();
