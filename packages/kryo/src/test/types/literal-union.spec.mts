import {describe} from "node:test";

import {LiteralUnionType} from "../../lib/literal-union.mts";
import {Ucs2StringType} from "../../lib/ucs2-string.mts";
import type {TypedValue} from "../helpers/test.mts";
import {runTests} from "../helpers/test.mts";

describe("LiteralUnionType", function () {
  const $Ucs2String: Ucs2StringType = new Ucs2StringType({maxLength: 10});
  type VarName = "foo" | "bar" | "baz";
  const $VarName: LiteralUnionType<VarName> = new LiteralUnionType<VarName>({
    type: $Ucs2String,
    values: ["foo", "bar", "baz"],
  });

  const items: TypedValue[] = [
    {name: "\"foo\"", value: "foo", valid: true},
    {name: "\"bar\"", value: "bar", valid: true},
    {name: "\"baz\"", value: "baz", valid: true},

    {name: "\"quz\"", value: "quz", valid: false},
    {name: "\" foo \"", value: " foo ", valid: false},
    {name: "\"FOO\"", value: "FOO", valid: false},
    {name: "0", value: 0, valid: false},
    {name: "1", value: 1, valid: false},
    {name: "\"\"", value: "", valid: false},
    {name: "\"0\"", value: "0", valid: false},
    {name: "\"true\"", value: "true", valid: false},
    {name: "\"false\"", value: "false", valid: false},
    {name: "Infinity", value: Infinity, valid: false},
    {name: "-Infinity", value: -Infinity, valid: false},
    {name: "NaN", value: NaN, valid: false},
    {name: "undefined", value: undefined, valid: false},
    {name: "null", value: null, valid: false},
    {name: "[]", value: [], valid: false},
    {name: "{}", value: {}, valid: false},
    {name: "/regex/", value: /regex/, valid: false},
  ];

  runTests($VarName, items);
});
