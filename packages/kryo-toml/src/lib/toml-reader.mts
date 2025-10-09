import type {CheckId, KryoContext, Reader, ReadVisitor, Result} from "kryo";
import * as toml from "smol-toml";

import {TomlValueReader} from "./toml-value-reader.mts";

export class TomlReader implements Reader<string> {
  trustInput?: boolean | undefined;

  readonly #valueReader: TomlValueReader;
  readonly #primitiveWrapper: string;

  constructor(trust?: boolean, primitiveWrapper: string = "") {
    this.trustInput = trust;
    this.#primitiveWrapper = primitiveWrapper;
    this.#valueReader = new TomlValueReader(trust);
  }

  readAny<T>(cx: KryoContext, raw: string, visitor: ReadVisitor<T>): Result<T, CheckId> {
    return this.#valueReader.readAny(cx, toml.parse(raw)[this.#primitiveWrapper], visitor);
  }

  readBoolean<T>(cx: KryoContext, raw: string, visitor: ReadVisitor<T>): Result<T, CheckId> {
    return this.#valueReader.readBoolean(cx, toml.parse(raw)[this.#primitiveWrapper], visitor);
  }

  readBytes<T>(cx: KryoContext, raw: string, visitor: ReadVisitor<T>): Result<T, CheckId> {
    return this.#valueReader.readBytes(cx, toml.parse(raw)[this.#primitiveWrapper], visitor);
  }

  readDate<T>(cx: KryoContext, raw: string, visitor: ReadVisitor<T>): Result<T, CheckId> {
    return this.#valueReader.readDate(cx, toml.parse(raw)[this.#primitiveWrapper], visitor);
  }

  readRecord<T>(cx: KryoContext, raw: string, visitor: ReadVisitor<T>): Result<T, CheckId> {
    return this.#valueReader.readRecord(cx, toml.parse(raw), visitor);
  }

  readFloat64<T>(cx: KryoContext, raw: string, visitor: ReadVisitor<T>): Result<T, CheckId> {
    return this.#valueReader.readFloat64(cx, toml.parse(raw)[this.#primitiveWrapper], visitor);
  }

  readList<T>(cx: KryoContext, raw: string, visitor: ReadVisitor<T>): Result<T, CheckId> {
    return this.#valueReader.readList(cx, toml.parse(raw)[this.#primitiveWrapper], visitor);
  }

  readMap<T>(cx: KryoContext, raw: string, visitor: ReadVisitor<T>): Result<T, CheckId> {
    return this.#valueReader.readMap(cx, toml.parse(raw), visitor);
  }

  readNull<T>(cx: KryoContext, raw: string, visitor: ReadVisitor<T>): Result<T, CheckId> {
    return this.#valueReader.readNull(cx, toml.parse(raw)[this.#primitiveWrapper], visitor);
  }

  readString<T>(cx: KryoContext, raw: string, visitor: ReadVisitor<T>): Result<T, CheckId> {
    return this.#valueReader.readString(cx, toml.parse(raw)[this.#primitiveWrapper], visitor);
  }
}

export const TOML_READER: TomlReader = new TomlReader();
