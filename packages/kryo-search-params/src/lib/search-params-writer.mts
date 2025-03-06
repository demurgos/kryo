import type {Writer} from "kryo";

import {SearchParamsValueWriter} from "./search-params-value-writer.mts";

export class SearchParamsWriter implements Writer<string> {
  readonly #valueWriter: SearchParamsValueWriter;
  readonly #primitiveWrapper: string;

  constructor(primitiveWrapper: string = "_") {
    this.#primitiveWrapper = primitiveWrapper;
    this.#valueWriter = new SearchParamsValueWriter();
  }

  writeAny(value: number): string {
    return new URLSearchParams({[this.#primitiveWrapper]: this.#valueWriter.writeAny(value)}).toString();
  }

  writeBoolean(value: boolean): string {
    return new URLSearchParams({[this.#primitiveWrapper]: this.#valueWriter.writeBoolean(value)}).toString();
  }

  writeBytes(value: Uint8Array): string {
    return new URLSearchParams({[this.#primitiveWrapper]: this.#valueWriter.writeBytes(value)}).toString();
  }

  writeDate(value: Date): string {
    return new URLSearchParams({[this.#primitiveWrapper]: this.#valueWriter.writeDate(value)}).toString();
  }

  writeFloat64(value: number): string {
    return new URLSearchParams({[this.#primitiveWrapper]: this.#valueWriter.writeFloat64(value)}).toString();
  }

  writeList(size: number, handler: <IW>(index: number, itemWriter: Writer<IW>) => IW): string {
    return new URLSearchParams({[this.#primitiveWrapper]: this.#valueWriter.writeList(size, handler)}).toString();
  }

  writeMap(
    size: number,
    keyHandler: <KW>(index: number, mapKeyWriter: Writer<KW>) => KW,
    valueHandler: <VW>(index: number, mapValueWriter: Writer<VW>) => VW,
  ): string {
    return this.#valueWriter.writeMap(size, keyHandler, valueHandler).toString();
  }

  writeNull(): string {
    return new URLSearchParams({[this.#primitiveWrapper]: this.#valueWriter.writeNull()}).toString();
  }

  writeRecord<K extends string>(keys: Iterable<K>, handler: <FW>(key: K, fieldWriter: Writer<FW>) => FW): string {
    return this.#valueWriter.writeRecord(keys, handler).toString();
  }

  writeString(value: string): string {
    return new URLSearchParams({[this.#primitiveWrapper]: this.#valueWriter.writeString(value)}).toString();
  }
}

export const SEARCH_PARAMS_WRITER: SearchParamsWriter = new SearchParamsWriter();
