import {describe} from "node:test";

import type {LiteralIoType} from "kryo/literal";
import {LiteralType} from "kryo/literal";
import {TsEnumType} from "kryo/ts-enum";
import {Ucs2StringType} from "kryo/ucs2-string";
import type {TestItem} from "kryo-testing";
import {registerErrMochaTests, registerMochaSuites} from "kryo-testing";

import {JSON_READER} from "../../lib/json-reader.mts";
import {JSON_WRITER} from "../../lib/json-writer.mts";

const Red: unique symbol = Symbol("Red");
const Green: unique symbol = Symbol("Green");
const Blue: unique symbol = Symbol("Blue");

const Color = {
  Red,
  Green,
  Blue,
} as const;

type Color = typeof Color[keyof typeof Color];

declare namespace Color {
  type Red = typeof Color.Red;
  type Green = typeof Color.Green;
  type Blue = typeof Color.Blue;
}

describe("kryo-json | Literal", function () {
  describe("Literal<\"foo\">", function () {
    const $FooLit: LiteralIoType<"foo"> = new LiteralType<"foo">(() => ({
      type: new Ucs2StringType({maxLength: Infinity}),
      value: "foo",
    }));

    const items: TestItem[] = [
      {
        value: "foo",
        io: [
          {writer: JSON_WRITER, reader: JSON_READER, raw: "\"foo\""},
        ],
      },
    ];

    registerMochaSuites($FooLit, items);

    describe("Reader", function () {
      const invalids: string[] = [
        "null",
        "true",
        "false",
        "",
        "0",
        "1",
        "0.5",
        "0.0001",
        "2.220446049250313e-16",
        "9007199254740992", // Number.MAX_SAFE_INTEGER + 1
        "-9007199254740993", // Number.MIN_SAFE_INTEGER - 2
        "\"\"",
        "\"0\"",
        "\"1\"",
        "\"null\"",
        "\"true\"",
        "\"false\"",
        "\"undefined\"",
        "\"NaN\"",
        "\"Infinity\"",
        "\"-Infinity\"",
        "\"bar\"",
        "[]",
        "{}",
        "\"1970-01-01T00:00:00.000Z\"",
      ];
      registerErrMochaTests(JSON_READER, $FooLit, invalids);
    });
  });

  describe("Literal<Color.Red>", function () {
    const $ColorRed: LiteralIoType<Color.Red> = new LiteralType<Color.Red>({
      type: new TsEnumType({enum: Color}),
      value: Color.Red,
    });

    const items: TestItem[] = [
      {
        name: "Color.Red",
        value: Color.Red,
        io: [
          {writer: JSON_WRITER, reader: JSON_READER, raw: "\"Red\""},
        ],
      },
      {
        name: "Symbol(Red)",
        value: Red,
        io: [
          {writer: JSON_WRITER, reader: JSON_READER, raw: "\"Red\""},
        ],
      },
    ];

    registerMochaSuites($ColorRed, items);

    describe("Reader", function () {
      const invalids: string[] = [
        "Green",
        "\"Green\"",
        "true",
        "false",
        "undefined",
        "",
        "0",
        "1",
        "0.5",
        "0.0001",
        "2.220446049250313e-16",
        "9007199254740992", // Number.MAX_SAFE_INTEGER + 1
        "-9007199254740993", // Number.MIN_SAFE_INTEGER - 2
        "\"\"",
        "\"0\"",
        "\"1\"",
        "\"null\"",
        "\"true\"",
        "\"false\"",
        "\"undefined\"",
        "\"NaN\"",
        "\"Infinity\"",
        "\"-Infinity\"",
        "\"bar\"",
        "[]",
        "{}",
        "\"1970-01-01T00:00:00.000Z\"",
      ];
      registerErrMochaTests(JSON_READER, $ColorRed, invalids);
    });
  });
});
