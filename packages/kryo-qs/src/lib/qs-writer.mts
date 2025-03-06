/**
 * @module kryo/writers/qs
 */

import type {Writer} from "kryo";
import qs from "qs";

import {QsValueWriter} from "./qs-value-writer.mts";

export class QsWriter implements Writer<string> {
  private readonly valueWriter: QsValueWriter;
  private readonly primitiveWrapper: string;

  constructor(primitiveWrapper: string = "_") {
    this.primitiveWrapper = primitiveWrapper;
    this.valueWriter = new QsValueWriter();
  }

  writeAny(value: number): string {
    return qs.stringify({[this.primitiveWrapper]: this.valueWriter.writeAny(value)});
  }

  writeBoolean(value: boolean): string {
    return qs.stringify({[this.primitiveWrapper]: this.valueWriter.writeBoolean(value)});
  }

  writeBytes(value: Uint8Array): string {
    return qs.stringify({[this.primitiveWrapper]: this.valueWriter.writeBytes(value)});
  }

  writeDate(value: Date): string {
    return qs.stringify({[this.primitiveWrapper]: this.valueWriter.writeDate(value)});
  }

  writeFloat64(value: number): string {
    return qs.stringify({[this.primitiveWrapper]: this.valueWriter.writeFloat64(value)});
  }

  writeList(size: number, handler: <IW>(index: number, itemWriter: Writer<IW>) => IW): string {
    return qs.stringify({[this.primitiveWrapper]: this.valueWriter.writeList(size, handler)});
  }

  writeMap(
    size: number,
    keyHandler: <KW>(index: number, mapKeyWriter: Writer<KW>) => KW,
    valueHandler: <VW>(index: number, mapValueWriter: Writer<VW>) => VW,
  ): string {
    return qs.stringify(this.valueWriter.writeMap(size, keyHandler, valueHandler));
  }

  writeNull(): string {
    return qs.stringify({[this.primitiveWrapper]: this.valueWriter.writeNull()});
  }

  writeRecord<K extends string>(keys: Iterable<K>, handler: <FW>(key: K, fieldWriter: Writer<FW>) => FW): string {
    return qs.stringify(this.valueWriter.writeRecord(keys, handler));
  }

  writeString(value: string): string {
    return qs.stringify({[this.primitiveWrapper]: this.valueWriter.writeString(value)});
  }
}

export const QS_WRITER: QsWriter = new QsWriter();
