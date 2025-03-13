/**
 * @module kryo/writers/json
 */

import type {Writer} from "kryo";

import type {JsonValue} from "./json-value.mts";
import {JsonValueWriter} from "./json-value-writer.mts";

export class JsonWriter implements Writer<string> {
  public readonly pretty: boolean;
  readonly #valueWriter: JsonValueWriter;

  /**
   * Creates a new JSON writer.
   *
   * @param pretty If `true`, indent with 2 spaces and add a final new line.
   */
  public constructor(pretty: boolean = false) {
    this.#valueWriter = new JsonValueWriter();
    this.pretty = pretty;
  }

  public writeAny(value: number): string {
    return this.#stringify(this.#valueWriter.writeAny(value));
  }

  public writeBoolean(value: boolean): string {
    return this.#stringify(this.#valueWriter.writeBoolean(value));
  }

  public writeBytes(value: Uint8Array): string {
    return this.#stringify(this.#valueWriter.writeBytes(value));
  }

  public writeDate(value: Date): string {
    return this.#stringify(this.#valueWriter.writeDate(value));
  }

  public writeList(size: number, handler: <IW>(index: number, itemWriter: Writer<IW>) => IW): string {
    return this.#stringify(this.#valueWriter.writeList(size, handler));
  }

  public writeMap(
    size: number,
    keyHandler: <KW>(index: number, mapKeyWriter: Writer<KW>) => KW,
    valueHandler: <VW>(index: number, mapValueWriter: Writer<VW>) => VW,
  ): string {
    return this.#stringify(this.#valueWriter.writeMap(size, keyHandler, valueHandler));
  }

  public writeRecord<K extends string>(keys: Iterable<K>, handler: <FW>(key: K, fieldWriter: Writer<FW>) => FW): string {
    return this.#stringify(this.#valueWriter.writeRecord(keys, handler));
  }

  public writeFloat64(value: number): string {
    return this.#stringify(this.#valueWriter.writeFloat64(value));
  }

  public writeNull(): string {
    return this.#stringify(this.#valueWriter.writeNull());
  }

  public writeString(value: string): string {
    return this.#stringify(this.#valueWriter.writeString(value));
  }

  #stringify(jsonValue: JsonValue): string {
    if (!this.pretty) {
      return JSON.stringify(jsonValue);
    } else {
      return `${JSON.stringify(jsonValue, null, 2)}\n`;
    }
  }
}

export const JSON_WRITER: JsonWriter = new JsonWriter(false);

export const PRETTY_JSON_WRITER: JsonWriter = new JsonWriter(true);
