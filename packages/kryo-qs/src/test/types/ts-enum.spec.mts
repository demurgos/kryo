import {describe} from "node:test";

import {CaseStyle} from "kryo";
import {TsEnumType} from "kryo/ts-enum";
import type {TestItem} from "kryo-testing";
import {registerErrMochaTests, registerMochaSuites} from "kryo-testing";

import {QsReader} from "../../lib/qs-reader.mts";
import {QsWriter} from "../../lib/qs-writer.mts";

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

describe("kryo-qs | TsEnum", function () {
  const QS_READER: QsReader = new QsReader();
  const QS_WRITER: QsWriter = new QsWriter();

  describe("Color", function () {
    const $Color: TsEnumType<Color> = new TsEnumType({enum: Color});

    const items: TestItem[] = [
      {
        name: "Color.Red",
        value: Color.Red,
        io: [
          {writer: QS_WRITER, reader: QS_READER, raw: "_=Red"},
        ],
      },
      {
        name: "Color.Green",
        value: Color.Green,
        io: [
          {writer: QS_WRITER, reader: QS_READER, raw: "_=Green"},
        ],
      },
      {
        name: "Color.Blue",
        value: Color.Blue,
        io: [
          {writer: QS_WRITER, reader: QS_READER, raw: "_=Blue"},
        ],
      },
      {
        name: "Symbol(Red)",
        value: Red,
        io: [
          {writer: QS_WRITER, reader: QS_READER, raw: "_=Red"},
        ],
      },
      {
        name: "Symbol(Green)",
        value: Green,
        io: [
          {writer: QS_WRITER, reader: QS_READER, raw: "_=Green"},
        ],
      },
      {
        name: "Symbol(Blue)",
        value: Blue,
        io: [
          {writer: QS_WRITER, reader: QS_READER, raw: "_=Blue"},
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
      registerErrMochaTests(QS_READER, $Color, invalids);
    });
  });

  describe("Node (Kebab-Case)", function () {
    const $Node: TsEnumType<Node> = new TsEnumType(() => ({enum: Node, changeCase: CaseStyle.KebabCase}));

    const items: TestItem[] = [
      {
        name: "Node.Expression",
        value: Node.Expression,
        io: [
          {writer: QS_WRITER, reader: QS_READER, raw: "_=expression"},
        ],
      },
      {
        name: "Node.BinaryOperator",
        value: Node.BinaryOperator,
        io: [
          {writer: QS_WRITER, reader: QS_READER, raw: "_=binary-operator"},
        ],
      },
      {
        name: "Node.BlockStatement",
        value: Node.BlockStatement,
        io: [
          {writer: QS_WRITER, reader: QS_READER, raw: "_=block-statement"},
        ],
      },
      {
        name: "Symbol(Expression)",
        value: Expression,
        io: [
          {writer: QS_WRITER, reader: QS_READER, raw: "_=expression"},
        ],
      },
      {
        name: "Symbol(BinaryOperator)",
        value: BinaryOperator,
        io: [
          {writer: QS_WRITER, reader: QS_READER, raw: "_=binary-operator"},
        ],
      },
      {
        name: "Symbol(BlockStatement)",
        value: BlockStatement,
        io: [
          {writer: QS_WRITER, reader: QS_READER, raw: "_=block-statement"},
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
      registerErrMochaTests(QS_READER, $Node, invalids);
    });
  });
});
