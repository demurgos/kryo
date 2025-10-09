import type {Writer} from "kryo";
import {stringify as tomlStringify} from "smol-toml";

import type {NullableTomlValue, TomlValue} from "./toml-value.mts";
import {TomlValueWriter} from "./toml-value-writer.mts";

export class TomlWriter implements Writer<string> {
  readonly #valueWriter: TomlValueWriter;
  readonly #primitiveWrapper: string;

  /**
   * Creates a new JSON writer.
   *
   * @param primitiveWrapper Key used to wrap primitive values. TOML does not support primitives at the root. Defaults to `""`
   */
  public constructor(primitiveWrapper: string = "") {
    this.#primitiveWrapper = primitiveWrapper;
    this.#valueWriter = new TomlValueWriter();
  }

  public writeAny(value: number): string {
    return this.#stringify({[this.#primitiveWrapper]: this.#valueWriter.writeAny(value) as TomlValue});
  }

  public writeBoolean(value: boolean): string {
    return this.#stringify({[this.#primitiveWrapper]: this.#valueWriter.writeBoolean(value) as TomlValue});
  }

  public writeBytes(value: Uint8Array): string {
    return this.#stringify({[this.#primitiveWrapper]: this.#valueWriter.writeBytes(value) as TomlValue});
  }

  public writeDate(value: Date): string {
    return this.#stringify({[this.#primitiveWrapper]: this.#valueWriter.writeDate(value) as TomlValue});
  }

  public writeList(size: number, handler: <IW>(index: number, itemWriter: Writer<IW>) => IW): string {
    return this.#stringify({[this.#primitiveWrapper]: this.#valueWriter.writeList(size, handler) as TomlValue});
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
    return this.#stringify({[this.#primitiveWrapper]: this.#valueWriter.writeFloat64(value) as TomlValue});
  }

  public writeNull(): string {
    return this.#stringify({[this.#primitiveWrapper]: this.#valueWriter.writeNull() as TomlValue});
  }

  public writeString(value: string): string {
    return this.#stringify({[this.#primitiveWrapper]: this.#valueWriter.writeString(value) as TomlValue});
  }

  #stringify(tomlValue: NullableTomlValue): string {
    return tomlStringify(tomlValue);
  }
}

export const TOML_WRITER: TomlWriter = new TomlWriter();
