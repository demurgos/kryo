import type {Writer} from "kryo";
import type {JsonValue} from "kryo-json/json-value";
import {JSON_VALUE_WRITER} from "kryo-json/json-value-writer";
import {JSON_WRITER} from "kryo-json/json-writer";

export class SearchParamsValueWriter implements Writer<URLSearchParams | string> {
  #isRoot: boolean;

  public constructor(isRoot: boolean = true) {
    this.#isRoot = isRoot;
  }

  writeAny(value: unknown): string {
    return JSON.stringify(value);
  }

  writeBoolean(value: boolean): "true" | "false" {
    return value ? "true" : "false";
  }

  writeBytes(value: Uint8Array): string {
    const result: string[] = new Array(value.length);
    const len: number = value.length;
    for (let i: number = 0; i < len; i++) {
      result[i] = (value[i] < 16 ? "0" : "") + value[i].toString(16);
    }
    return result.join("");
  }

  writeDate(value: Date): string {
    return value.toISOString();
  }

  writeFloat64(value: number): string {
    if (isNaN(value)) {
      return "NaN";
    } else if (value === Infinity) {
      return "+Infinity";
    } else if (value === -Infinity) {
      return "-Infinity";
    }
    return value.toString(10);
  }

  writeList(size: number, handler: <IW>(index: number, itemWriter: Writer<IW>) => IW): string {
    return JSON_WRITER.writeList(size, handler);
  }

  writeNull(): "" {
    return "";
  }

  writeMap(
    size: number,
    keyHandler: <KW>(index: number, mapKeyWriter: Writer<KW>) => KW,
    valueHandler: <VW>(index: number, mapValueWriter: Writer<VW>) => VW,
  ): URLSearchParams | string {
    if (!this.#isRoot) {
      return JSON_WRITER.writeMap(size, keyHandler, valueHandler);
    }

    const result: URLSearchParams = new URLSearchParams();
    for (let index: number = 0; index < size; index++) {
      // TODO: Use a specialized writer that only accepts strings and numbers (KeyMustBeAStringError)
      // Let users build custom serializers if they want
      const key: JsonValue = keyHandler<JsonValue>(index, JSON_VALUE_WRITER);
      result.set(JSON.stringify(key), valueHandler(index, NESTED_SEARCH_PARAMS_VALUE_WRITER as Writer<string>));
    }
    return result;
  }

  writeRecord<K extends string>(keys: Iterable<K>, handler: <FW>(key: K, fieldWriter: Writer<FW>) => FW): URLSearchParams | string {
    if (!this.#isRoot) {
      return JSON_WRITER.writeRecord(keys, handler);
    }

    const result: URLSearchParams = new URLSearchParams();
    for (const key of keys) {
      result.set(key, handler(key, NESTED_SEARCH_PARAMS_VALUE_WRITER as Writer<string>));
    }
    return result;
  }

  writeString(value: string): string {
    return value;
  }
}

export const SEARCH_PARAMS_VALUE_WRITER: SearchParamsValueWriter = new SearchParamsValueWriter();
const NESTED_SEARCH_PARAMS_VALUE_WRITER: SearchParamsValueWriter = new SearchParamsValueWriter(false);
