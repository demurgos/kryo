const Custom: unique symbol = Symbol("Custom");
const Aggregate: unique symbol = Symbol("Aggregate");
const BaseType: unique symbol = Symbol("BaseType");
const InstanceOf: unique symbol = Symbol("InstanceOf");
const Size: unique symbol = Symbol("Size");
const Float64: unique symbol = Symbol("Float64");
const LiteralType: unique symbol = Symbol("LiteralType");
const LiteralValue: unique symbol = Symbol("LiteralValue");
const LowerCase: unique symbol = Symbol("LowerCase");
const MissingKey: unique symbol = Symbol("MissingKey");
const PropertyKey: unique symbol = Symbol("PropertyKey");
const PropertyKeyFormat: unique symbol = Symbol("PropertyKeyFormat");
const PropertyValue: unique symbol = Symbol("PropertyValue");
const Range: unique symbol = Symbol("Range");
const StringPattern: unique symbol = Symbol("StringPattern");
const Trimmed: unique symbol = Symbol("Trimmed");
const UnionMatch: unique symbol = Symbol("UnionMatch");
const UnionTagPresent: unique symbol = Symbol("UnionTagPresent");
const UnionTagValue: unique symbol = Symbol("UnionTagValue");
const UnicodeNormalization: unique symbol = Symbol("UnicodeNormalization");
const UnixTimestamp: unique symbol = Symbol("UnixTimestamp");

const CheckKind = {
  Custom,
  Aggregate,
  BaseType,
  InstanceOf,
  Size,
  Float64,
  LiteralType,
  LiteralValue,
  LowerCase,
  MissingKey,
  PropertyKey,
  PropertyKeyFormat,
  PropertyValue,
  Range,
  StringPattern,
  Trimmed,
  UnionMatch,
  UnionTagPresent,
  UnionTagValue,
  UnicodeNormalization,
  UnixTimestamp,
} as const;

type CheckKind = typeof CheckKind[keyof typeof CheckKind];

declare namespace CheckKind {
  type Custom = typeof CheckKind.Custom;
  type Aggregate = typeof CheckKind.Aggregate;
  type BaseType = typeof CheckKind.BaseType;
  type InstanceOf = typeof CheckKind.InstanceOf;
  type Size = typeof CheckKind.Size;
  type Float64 = typeof CheckKind.Float64;
  type LiteralType = typeof CheckKind.LiteralType;
  type LiteralValue = typeof CheckKind.LiteralValue;
  type LowerCase = typeof CheckKind.LowerCase;
  type MissingKey = typeof CheckKind.MissingKey;
  type PropertyKey = typeof CheckKind.PropertyKey;
  type PropertyKeyFormat = typeof CheckKind.PropertyKeyFormat;
  type PropertyValue = typeof CheckKind.PropertyValue;
  type Range = typeof CheckKind.Range;
  type StringPattern = typeof CheckKind.StringPattern;
  type Trimmed = typeof CheckKind.Trimmed;
  type UnionMatch = typeof CheckKind.UnionMatch;
  type UnionTagPresent = typeof CheckKind.UnionTagPresent;
  type UnionTagValue = typeof CheckKind.UnionTagValue;
  type UnicodeNormalization = typeof CheckKind.UnicodeNormalization;
  type UnixTimestamp = typeof CheckKind.UnixTimestamp;
}

export {CheckKind};
