/**
 * @module kryo/writers/qs-value
 */

import type {Writer} from "kryo";
import {StructuredWriter} from "kryo/writers/structured";
import {JSON_WRITER} from "kryo-json/json-writer";

import type {QsPrimitive,QsValue} from "./qs-value.mjs";

export class QsValueWriter extends StructuredWriter<QsPrimitive> implements Writer<QsValue> {
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

  writeNull(): "" {
    return "";
  }

  writeMap(
    size: number,
    keyHandler: <KW>(index: number, mapKeyWriter: Writer<KW>) => KW,
    valueHandler: <VW>(index: number, mapValueWriter: Writer<VW>) => VW,
  ): Record<string, QsValue> {
    const result: Record<string, QsValue> = Object.create(null);
    for (let index: number = 0; index < size; index++) {
      // TODO: Use a specialized writer that only accepts strings and numbers (KeyMustBeAStringError)
      // Let users build custom serializers if they want
      const key: string = keyHandler(index, JSON_WRITER);
      result[JSON.stringify(key)] = valueHandler<QsValue>(index, this);
    }
    return result;
  }

  writeString(value: string): string {
    return value;
  }
}

export const QS_VALUE_WRITER: QsValueWriter = new QsValueWriter();
