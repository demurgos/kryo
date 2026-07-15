import {describe} from "node:test";

import {CaseStyle} from "kryo";
import {TsEnumType} from "kryo/ts-enum";
import type {TestItem} from "kryo-testing";
import {registerErrMochaTests, registerMochaSuites} from "kryo-testing";

import {TOML_READER} from "../../lib/toml-reader.mts";
import {TOML_WRITER} from "../../lib/toml-writer.mts";

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

const Expression: unique symbol = Symbol("Expression");
const BinaryOperator: unique symbol = Symbol("BinaryOperator");
const BlockStatement: unique symbol = Symbol("BlockStatement");

const Node = {
  Expression,
  BinaryOperator,
  BlockStatement,
} as const;

type Node = typeof Node[keyof typeof Node];

declare namespace Node {
  type Expression = typeof Node.Expression;
  type BinaryOperator = typeof Node.BinaryOperator;
  type BlockStatement = typeof Node.BlockStatement;
}

describe("kryo-toml | TsEnum", function () {
  describe("Color", function () {
    const $Color: TsEnumType<Color> = new TsEnumType({enum: Color});

    const items: TestItem[] = [
      {
        name: "Color.Red",
        value: Color.Red,
        io: [
          {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"Red\"\n"},
        ],
      },
      {
        name: "Color.Green",
        value: Color.Green,
        io: [
          {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"Green\"\n"},
        ],
      },
      {
        name: "Color.Blue",
        value: Color.Blue,
        io: [
          {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"Blue\"\n"},
        ],
      },
      {
        name: "Symbol(Red)",
        value: Red,
        io: [
          {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"Red\"\n"},
        ],
      },
      {
        name: "Symbol(Green)",
        value: Green,
        io: [
          {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"Green\"\n"},
        ],
      },
      {
        name: "Symbol(Blue)",
        value: Blue,
        io: [
          {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"Blue\"\n"},
        ],
      },
    ];

    registerMochaSuites($Color, items);

    describe("Reader", function () {
      const invalids: string[] = [
        "{\"type\":\"circle\"}",
        "{\"type\":\"circle\",\"radius\":true}",
        "null",
        "true",
        "false",
        "",
        "0",
        "1",
        "0.5",
        "0.0001",
        "2.220446049250313e-16",
        "9007199254740991",
        "-9007199254740991",
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
        "\"foo\"",
        "[]",
        "{}",
        "\"1970-01-01T00:00:00.000Z\"",
      ];
      registerErrMochaTests(TOML_READER, $Color, invalids);
    });
  });

  describe("Node (Kebab-Case)", function () {
    const $Node: TsEnumType<Node> = new TsEnumType(() => ({enum: Node, changeCase: CaseStyle.KebabCase}));

    const items: TestItem[] = [
      {
        name: "Node.Expression",
        value: Node.Expression,
        io: [
          {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"expression\"\n"},
        ],
      },
      {
        name: "Node.BinaryOperator",
        value: Node.BinaryOperator,
        io: [
          {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"binary-operator\"\n"},
        ],
      },
      {
        name: "Node.BlockStatement",
        value: Node.BlockStatement,
        io: [
          {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"block-statement\"\n"},
        ],
      },
      {
        name: "Symbol(Expression)",
        value: Expression,
        io: [
          {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"expression\"\n"},
        ],
      },
      {
        name: "Symbol(BinaryOperator)",
        value: BinaryOperator,
        io: [
          {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"binary-operator\"\n"},
        ],
      },
      {
        name: "Symbol(BlockStatement)",
        value: BlockStatement,
        io: [
          {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"block-statement\"\n"},
        ],
      },
    ];

    registerMochaSuites($Node, items);

    describe("Reader", function () {
      const invalids: string[] = [
        "{\"type\":\"circle\"}",
        "{\"type\":\"circle\",\"radius\":true}",
        "null",
        "true",
        "false",
        "",
        "0",
        "1",
        "0.5",
        "0.0001",
        "2.220446049250313e-16",
        "9007199254740991",
        "-9007199254740991",
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
        "\"foo\"",
        "[]",
        "{}",
        "\"1970-01-01T00:00:00.000Z\"",
      ];
      registerErrMochaTests(TOML_READER, $Node, invalids);
    });
  });
});
