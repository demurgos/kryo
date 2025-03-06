/**
 * @module kryo/writers/json-value
 */

import type {Writer} from "kryo";
import {StructuredWriter} from "kryo/writers/structured";

import type {JsonPrimitive, JsonValue} from "./json-value.mts";

export class JsonValueWriter extends StructuredWriter<JsonPrimitive> implements Writer<JsonValue> {
  writeFloat64(value: number): number | string {
    if (isNaN(value)) {
      return "NaN";
    } else if (value === Infinity) {
      return "+Infinity";
    } else if (value === -Infinity) {
      return "-Infinity";
    } else if (Object.is(value, "-0")) {
      return "-0";
    }
    return value;
  }

  writeDate(value: Date): string {
    return value.toISOString();
  }

  writeNull(): null {
    return null;
  }

  writeBytes(value: Uint8Array): string {
    const result: string[] = new Array(value.length);
    const len: number = value.length;
    for (let i: number = 0; i < len; i++) {
      result[i] = (value[i] < 16 ? "0" : "") + value[i].toString(16);
    }
    return result.join("");
  }

  writeBoolean(value: boolean): boolean {
    return value;
  }

  writeString(value: string): string {
    return value;
  }

  writeMap(
    size: number,
    keyHandler: <KW>(index: number, mapKeyWriter: Writer<KW>) => KW,
    valueHandler: <VW>(index: number, mapValueWriter: Writer<VW>) => VW,
  ): Record<string, JsonValue> {
    // TODO: Use a specialized writer that only accepts strings and numbers (KeyMustBeAStringError)
    // Let users build custom serializers if they want
    const jsonWriter: JsonValueWriter = new JsonValueWriter();
    const result: Record<string, JsonValue> = Object.create(null);
    for (let index: number = 0; index < size; index++) {
      const key: JsonValue = keyHandler<JsonValue>(index, jsonWriter);
      result[JSON.stringify(key)] = valueHandler<JsonValue>(index, this);
    }
    return result;
  }
}

export const JSON_VALUE_WRITER: JsonValueWriter = new JsonValueWriter();
