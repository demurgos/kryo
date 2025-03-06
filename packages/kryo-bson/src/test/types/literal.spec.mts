import {describe} from "node:test";

import type {LiteralIoType} from "kryo/literal";
import {LiteralType} from "kryo/literal";
import {TsEnumType} from "kryo/ts-enum";
import {Ucs2StringType} from "kryo/ucs2-string";
import type {TestItem} from "kryo-testing";
import {registerErrMochaTests, registerMochaSuites} from "kryo-testing";

import {BsonReader} from "../../lib/bson-reader.mts";
import {BsonWriter} from "../../lib/bson-writer.mts";

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

describe("kryo-bson | Literal", function () {
  const BSON_READER: BsonReader = new BsonReader();
  const BSON_WRITER: BsonWriter = new BsonWriter();

  describe("Literal<\"foo\">", function () {
    const $FooLit: LiteralIoType<"foo"> = new LiteralType<"foo">(() => ({
      type: new Ucs2StringType({maxLength: Infinity}),
      value: "foo",
    }));

    const items: TestItem[] = [
      {
        value: "foo",
        io: [
          {writer: BSON_WRITER, reader: BSON_READER, raw: Buffer.from("10000000025f0004000000666f6f0000", "hex")},
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
      registerErrMochaTests(BSON_READER, $FooLit, invalids);
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
          {writer: BSON_WRITER, reader: BSON_READER, raw: Buffer.from("10000000025f00040000005265640000", "hex")},
        ],
      },
      {
        name: "Symbol(Red)",
        value: Red,
        io: [
          {writer: BSON_WRITER, reader: BSON_READER, raw: Buffer.from("10000000025f00040000005265640000", "hex")},
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
      registerErrMochaTests(BSON_READER, $ColorRed, invalids);
    });
  });
});
