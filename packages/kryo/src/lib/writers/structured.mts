/**
 * @module kryo/writers/structured
 */

import type {AnyKey, Writer} from "../index.mts";

export interface StructuredRecord<T> {
  [key: AnyKey]: StructuredValue<T>;
}

export type StructuredValue<T> = T | StructuredValue<T>[] | StructuredRecord<T>;

/**
 * Base class for `json`, `qs` and `bson` writers.
 */
export abstract class StructuredWriter<W> implements Writer<StructuredValue<W>> {
  writeAny(value: unknown): W {
    return JSON.parse(JSON.stringify(value));
  }

  abstract writeBoolean(value: boolean): W;

  abstract writeBytes(value: Uint8Array): W;

  abstract writeDate(value: Date): W;

  abstract writeFloat64(value: number): W;

  writeList(size: number, handler: <IW>(index: number, itemWriter: Writer<IW>) => IW): StructuredValue<W>[] {
    const result: StructuredValue<W>[] = [];
    for (let index: number = 0; index < size; index++) {
      result.push(handler<StructuredValue<W>>(index, this));
    }
    return result;
  }

  abstract writeMap(
    size: number,
    keyHandler: <KW>(index: number, mapKeyWriter: Writer<KW>) => KW,
    valueHandler: <VW>(index: number, mapValueWriter: Writer<VW>) => VW,
  ): Record<StructuredValue<W> & AnyKey, StructuredValue<W>>;

  abstract writeNull(): W;

  writeRecord<K extends string>(keys: Iterable<K>, handler: <FW>(key: K, fieldWriter: Writer<FW>) => FW): Record<K, StructuredValue<W>> {
    const result: Record<K, StructuredValue<W>> = Object.create(null);
    for (const key of keys) {
      result[key] = handler<StructuredValue<W>>(key, this);
    }
    return result;
  }

  abstract writeString(value: string): W;
}
