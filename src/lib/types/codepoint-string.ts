import {Incident} from "incident";
import {nfc as unormNfc} from "unorm";
import {LowerCaseError} from "../errors/lower-case";
import {MaxCodepointsError} from "../errors/max-codepoints";
import {MinCodepointsError} from "../errors/min-codepoints";
import {NotTrimmedError} from "../errors/not-trimmed";
import {PatternNotMatchedError} from "../errors/pattern-not-matched";
import {WrongTypeError} from "../errors/wrong-type";
import {checkedUcs2Decode} from "../helpers/checked-ucs2-decode";
import {VersionedType} from "../interfaces";

export enum Normalization {
  None,
  Nfc
}

export type Name = "codepoint-string";
export const name: Name = "codepoint-string";
export type T = string;
/* tslint:disable-next-line:no-namespace */
export namespace json {
  export type Input = string;
  export type Output = string;
  export interface Type {
    name: Name;
    normalization: "none" | "nfc";
    enforceUnicodeRegExp: boolean;
    pattern?: [string, string];
    lowerCase: boolean;
    /**
     * @see [[Ucs2StringOptions.trimmed]]
     */
    trimmed: boolean;
    minCodepoints?: number;
    maxCodepoints: number;
  }
}
export type Diff = [string, string];
export interface Options {
  /**
   * Ensure NFC normalization when reading strings.
   *
   * References:
   * - http://unicode.org/faq/normalization.html
   * - http://unicode.org/reports/tr15/
   */
  normalization: Normalization;

  enforceUnicodeRegExp: boolean;
  pattern?: RegExp;
  lowerCase: boolean;

  /**
   * The string cannot start or end with any of the following whitespace and line terminator
   * characters:
   *
   * - Unicode Character 'CHARACTER TABULATION' (U+0009)
   * - Unicode Character 'LINE FEED (LF)' (U+000A)
   * - Unicode Character 'LINE TABULATION' (U+000B)
   * - Unicode Character 'FORM FEED (FF)' (U+000C)
   * - Unicode Character 'CARRIAGE RETURN (CR)' (U+000D)
   * - Unicode Character 'SPACE' (U+0020)
   * - Unicode Character 'NO-BREAK SPACE' (U+00A0)
   * - Unicode Character 'LINE SEPARATOR' (U+2028)
   * - Unicode Character 'PARAGRAPH SEPARATOR' (U+2029)
   * - Unicode Character 'ZERO WIDTH NO-BREAK SPACE' (U+FEFF)
   * - Any other Unicode character of the "Separator, space" (Zs) general category
   *
   * @see <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim>
   * @see <http://www.fileformat.info/info/unicode/category/Zs/list.htm>
   */
  trimmed: boolean;
  minCodepoints?: number;
  maxCodepoints: number;
}
export const defaultOptions: Options = {
  normalization: Normalization.Nfc,
  enforceUnicodeRegExp: true,
  lowerCase: false,
  trimmed: false,
  maxCodepoints: Infinity
};

export class CodepointStringType implements VersionedType<T, json.Input, json.Output, Diff> {
  static fromJSON(options: json.Type): CodepointStringType {
    const resolvedOptions: Options = {
      normalization: options.normalization === "none" ? Normalization.None : Normalization.Nfc,
      enforceUnicodeRegExp: options.enforceUnicodeRegExp,
      lowerCase: options.lowerCase,
      trimmed: options.trimmed,
      maxCodepoints: options.maxCodepoints
    };
    if (options.pattern !== undefined) {
      resolvedOptions.pattern = new RegExp(options.pattern[0], options.pattern[1]);
    }
    if (options.minCodepoints !== undefined) {
      resolvedOptions.minCodepoints = options.minCodepoints;
    }
    return new CodepointStringType(resolvedOptions);
  }

  readonly name: Name = name;
  options: Options;

  constructor(options: Options) {
    this.options = {...defaultOptions, ...options};
  }

  toJSON(): json.Type {
    const jsonType: json.Type = {
      name: name,
      normalization: this.options.normalization === Normalization.None ? "none" : "nfc",
      enforceUnicodeRegExp: this.options.enforceUnicodeRegExp,
      lowerCase: this.options.lowerCase,
      trimmed: this.options.trimmed,
      maxCodepoints: this.options.maxCodepoints
    };
    if (this.options.pattern !== undefined) {
      jsonType.pattern = [this.options.pattern.source, this.options.pattern.flags];
    }
    if (this.options.minCodepoints !== undefined) {
      jsonType.minCodepoints = this.options.minCodepoints;
    }
    return jsonType;
  }

  readTrusted(format: "json" | "bson", val: json.Output): T {
    return val;
  }

  read(format: "json" | "bson", val: any): T {
    const error: Error | undefined = this.testError(val);
    if (error !== undefined) {
      throw error;
    }
    return val;
  }

  write(format: "json" | "bson", val: T): json.Output {
    return val;
  }

  testError(val: T): Error | undefined {
    if (!(typeof val === "string")) {
      return WrongTypeError.create("string", val);
    }

    switch (this.options.normalization) {
      case Normalization.Nfc:
        if (val !== unormNfc(val)) {
          return Incident("UnicodeNormalization", "Not NFC-Normalized");
        }
        break;
      case Normalization.None:
        break;
    }

    if (this.options.lowerCase && val !== val.toLowerCase()) {
      return LowerCaseError.create(val);
    }

    if (this.options.trimmed && val !== val.trim()) {
      return NotTrimmedError.create(val);
    }

    let codepointCount: number;
    try {
      codepointCount = checkedUcs2Decode(val).length;
    } catch (err) {
      return err;
    }

    const minCodepoints: number | undefined = this.options.minCodepoints;
    if (typeof minCodepoints === "number" && codepointCount < minCodepoints) {
      return MinCodepointsError.create(val, codepointCount, minCodepoints);
    }

    if (codepointCount > this.options.maxCodepoints) {
      return MaxCodepointsError.create(val, codepointCount, this.options.maxCodepoints);
    }

    if (this.options.pattern instanceof RegExp) {
      if (!this.options.pattern.unicode && this.options.enforceUnicodeRegExp) {
        throw new Incident(
          "NonUnicodeRegExp",
          "Enforced unicode RegExp, use `enforceUnicodeRegExp = false` or `Ucs2StringType`"
        );
      }

      if (!this.options.pattern.test(val)) {
        return PatternNotMatchedError.create(this.options.pattern, val);
      }
    }

    return undefined;
  }

  test(val: T): boolean {
    return this.testError(val) === undefined;
  }

  equals(val1: T, val2: T): boolean {
    return val1 === val2;
  }

  clone(val: T): T {
    return val;
  }

  diff(oldVal: T, newVal: T): Diff | undefined {
    return oldVal === newVal ? undefined : [oldVal, newVal];
  }

  patch(oldVal: T, diff: Diff | undefined): T {
    return diff === undefined ? oldVal : diff[1];
  }

  reverseDiff(diff: Diff | undefined): Diff | undefined {
    return diff === undefined ? undefined : [diff[1], diff[0]];
  }

  squash(diff1: Diff | undefined, diff2: Diff | undefined): Diff | undefined {
    if (diff1 === undefined) {
      return diff2 === undefined ? undefined : [diff2[0], diff2[1]];
    } else if (diff2 === undefined) {
      return [diff1[0], diff1[1]];
    }
    return diff1[0] === diff2[1] ? undefined : [diff1[0], diff2[1]];
  }
}

export {CodepointStringType as Type};