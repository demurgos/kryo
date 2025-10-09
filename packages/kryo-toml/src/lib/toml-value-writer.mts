import type {Writer} from "kryo";
import * as toml from "smol-toml";

import {type NullableTomlValue, TomlDate, type TomlValue} from "./toml-value.mts";

export class TomlValueWriter implements Writer<NullableTomlValue> {
  writeAny(value: unknown): NullableTomlValue {
    const input = {"": value};
    const output = toml.parse(toml.stringify(input));
    return output[""] ?? null;
  }

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

  writeDate(value: Date): TomlDate {
    return new TomlDate(value);
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

  writeList(size: number, handler: <IW>(index: number, itemWriter: Writer<IW>) => IW): NullableTomlValue {
    const result: NullableTomlValue[] = [];
    for (let index: number = 0; index < size; index++) {
      result.push(handler<NullableTomlValue>(index, this));
    }
    return result as TomlValue;
  }

  writeMap(
    size: number,
    keyHandler: <KW>(index: number, mapKeyWriter: Writer<KW>) => KW,
    valueHandler: <VW>(index: number, mapValueWriter: Writer<VW>) => VW,
  ): NullableTomlValue {
    // TODO: Use a specialized writer that only accepts strings and numbers (KeyMustBeAStringError)
    // Let users build custom serializers if they want
    const tomlWriter: TomlValueWriter = new TomlValueWriter();
    const result: Record<string, NullableTomlValue> = Object.create(null);
    for (let index: number = 0; index < size; index++) {
      const key: NullableTomlValue = keyHandler<NullableTomlValue>(index, tomlWriter);
      result[JSON.stringify(key)] = valueHandler<NullableTomlValue>(index, this);
    }
    return result as TomlValue;
  }

  writeNull(): NullableTomlValue {
    return null;
  }

  writeRecord<K extends string>(keys: Iterable<K>, handler: <FW>(key: K, fieldWriter: Writer<FW>) => FW): NullableTomlValue {
    const result: Record<K, NullableTomlValue> = Object.create(null);
    for (const key of keys) {
      result[key] = handler<NullableTomlValue>(key, this);
    }
    return result as TomlValue;
  }
}

export const TOML_VALUE_WRITER: TomlValueWriter = new TomlValueWriter();
