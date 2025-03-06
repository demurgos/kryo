/**
 * @module kryo/writers/bson-value
 */

import {Binary} from "bson";
import type {Writer} from "kryo";
import type {StructuredValue} from "kryo/writers/structured";
import {StructuredWriter} from "kryo/writers/structured";
import {JsonWriter} from "kryo-json/json-writer";

export type BsonPrimitive = number | boolean | Binary | string | null | Date;

export type BsonValue = StructuredValue<BsonPrimitive>;

export class BsonValueWriter extends StructuredWriter<BsonPrimitive> implements Writer<BsonValue> {
  constructor() {
    super();
  }

  writeFloat64(value: number): number {
    return value;
  }

  writeBoolean(value: boolean): boolean {
    return value;
  }

  writeNull(): null {
    return null;
  }

  writeBytes(value: Uint8Array): Binary {
    return new Binary(Buffer.from(value));
  }

  writeDate(value: Date): Date {
    return new Date(value.getTime());
  }

  writeString(value: string): string {
    return value;
  }

  writeMap(
    size: number,
    keyHandler: <KW>(index: number, mapKeyWriter: Writer<KW>) => KW,
    valueHandler: <VW>(index: number, mapValueWriter: Writer<VW>) => VW,
  ): Record<string, BsonValue> {
    const result: Record<string, BsonValue> = Object.create(null);
    for (let index: number = 0; index < size; index++) {
      // TODO: Use a specialized writer that only accepts strings and numbers (KeyMustBeAStringError)
      // Let users build custom serializers if they want
      const jsonWriter: JsonWriter = new JsonWriter();
      const key: string = keyHandler<string>(index, jsonWriter);
      result[JSON.stringify(key)] = valueHandler<BsonValue>(index, this);
    }
    return result;
  }
}

export const BSON_VALUE_WRITER: BsonValueWriter = new BsonValueWriter();
