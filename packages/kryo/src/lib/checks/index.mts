import type {AggregateCheck} from "./aggregate.mts";
import {formatAggregateCheck} from "./aggregate.mts";
import type {BaseTypeCheck} from "./base-type.mts";
import {formatBaseTypeCheck} from "./base-type.mts";
import {CheckKind} from "./check-kind.mts";
import type {CustomCheck} from "./custom.mts";
import {formatCustomCheck} from "./custom.mts";
import type {Float64Check} from "./float64.mts";
import {formatFloat64Check} from "./float64.mts";
import type {InstanceOfCheck} from "./instance-of.mts";
import {formatInstanceOfCheck} from "./instance-of.mts";
import type {LiteralTypeCheck} from "./literal-type.mts";
import {formatLiteralTypeCheck} from "./literal-type.mts";
import type {LiteralValueCheck} from "./literal-value.mts";
import {formatLiteralValueCheck} from "./literal-value.mts";
import {formatLowerCaseCheck, type LowerCaseCheck} from "./lower-case.mts";
import {formatMissingKeyCheck, type MissingKeyCheck} from "./missing-key.mts";
import type {PropertyKeyCheck} from "./property-key.mts";
import {formatPropertyKeyCheck} from "./property-key.mts";
import type {PropertyKeyFormatCheck} from "./property-key-format.mts";
import {formatPropertyKeyFormatCheck} from "./property-key-format.mts";
import type {PropertyValueCheck} from "./property-value.mts";
import {formatPropertyValueCheck} from "./property-value.mts";
import type {RangeCheck} from "./range.mts";
import {formatRangeCheck} from "./range.mts";
import type {SizeCheck} from "./size.mts";
import {formatSizeCheck} from "./size.mts";
import type {StringPatternCheck} from "./string-pattern.mts";
import {formatStringPatternCheck} from "./string-pattern.mts";
import type {TrimmedCheck} from "./trimmed.mts";
import {formatTrimmedCheck} from "./trimmed.mts";
import type {UnicodeNormalizationCheck} from "./unicode-normalization.mts";
import {formatUnicodeNormalizationCheck} from "./unicode-normalization.mts";
import type {UnionMatchCheck} from "./union-match.mts";
import {formatUnionMatchCheck} from "./union-match.mts";
import type {UnionTagPresentCheck} from "./union-tag-present.mts";
import {formatUnionTagPresentCheck} from "./union-tag-present.mts";
import type {UnionTagValueCheck} from "./union-tag-value.mts";
import {formatUnionTagValueCheck} from "./union-tag-value.mts";
import type {UnixTimestampCheck} from "./unix-timestamp.mts";
import {formatUnixTimestampCheck} from "./unix-timestamp.mts";

export type Check =
  AggregateCheck
  | BaseTypeCheck
  | CustomCheck
  | Float64Check
  | InstanceOfCheck
  | LiteralTypeCheck
  | LiteralValueCheck
  | LowerCaseCheck
  | MissingKeyCheck
  | PropertyKeyCheck
  | PropertyKeyFormatCheck
  | PropertyValueCheck
  | RangeCheck
  | SizeCheck
  | StringPatternCheck
  | TrimmedCheck
  | UnicodeNormalizationCheck
  | UnionMatchCheck
  | UnionTagPresentCheck
  | UnionTagValueCheck
  | UnixTimestampCheck
  ;

export function format(check: Check) {
  switch (check.check) {
    case CheckKind.Aggregate:
      return formatAggregateCheck(check);
    case CheckKind.BaseType:
      return formatBaseTypeCheck(check);
    case CheckKind.Custom:
      return formatCustomCheck(check);
    case CheckKind.Float64:
      return formatFloat64Check(check);
    case CheckKind.InstanceOf:
      return formatInstanceOfCheck(check);
    case CheckKind.LiteralType:
      return formatLiteralTypeCheck();
    case CheckKind.LiteralValue:
      return formatLiteralValueCheck();
    case CheckKind.LowerCase:
      return formatLowerCaseCheck();
    case CheckKind.MissingKey:
      return formatMissingKeyCheck(check);
    case CheckKind.PropertyKey:
      return formatPropertyKeyCheck();
    case CheckKind.PropertyKeyFormat:
      return formatPropertyKeyFormatCheck();
    case CheckKind.PropertyValue:
      return formatPropertyValueCheck();
    case CheckKind.Range:
      return formatRangeCheck(check);
    case CheckKind.Size:
      return formatSizeCheck(check);
    case CheckKind.StringPattern:
      return formatStringPatternCheck();
    case CheckKind.Trimmed:
      return formatTrimmedCheck();
    case CheckKind.UnicodeNormalization:
      return formatUnicodeNormalizationCheck(check);
    case CheckKind.UnionMatch:
      return formatUnionMatchCheck();
    case CheckKind.UnionTagPresent:
      return formatUnionTagPresentCheck(check);
    case CheckKind.UnionTagValue:
      return formatUnionTagValueCheck(check);
    case CheckKind.UnixTimestamp:
      return formatUnixTimestampCheck();
    default:
      throw new Error("unexpected check kind");
  }
}
