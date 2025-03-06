import {describe} from "node:test";

import { CaseStyle } from "../../lib/index.mts";
import { TsEnumType } from "../../lib/ts-enum.mts";
import type { TypedValue } from "../helpers/test.mts";
import { runTests } from "../helpers/test.mts";

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

describe("TsEnum", function () {
  const $Color: TsEnumType<Color> = new TsEnumType({enum: Color});

  const items: TypedValue[] = [
    {
      name: "Color.Red",
      value: Color.Red,
      valid: true,
    },
    {
      name: "Color.Green",
      value: Color.Green,
      valid: true,
    },
    {
      name: "Color.Blue",
      value: Color.Blue,
      valid: true,
    },
    {
      name: "Symbol(Red)",
      value: Red,
      valid: true,
    },
    {
      name: "Symbol(Green)",
      value: Green,
      valid: true,
    },
    {
      name: "Symbol(Blue)",
      value: Blue,
      valid: true,
    },

    {name: "new Date()", value: new Date(), valid: false},
    {name: "0", value: 0, valid: false},
    {name: "1", value: 1, valid: false},
    {name: "2", value: 2, valid: false},
    {name: "3", value: 3, valid: false},
    {name: "-1", value: -1, valid: false},
    {name: "\"\"", value: "", valid: false},
    {name: "\"0\"", value: "0", valid: false},
    {name: "\"true\"", value: "true", valid: false},
    {name: "\"Red\"", value: "Red", valid: false},
    {name: "\"red\"", value: "red", valid: false},
    {name: "\"RED\"", value: "RED", valid: false},
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

  runTests($Color, items);
});

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

describe("SimpleEnum: rename KebabCase", function () {
  const $Node: TsEnumType<Node> = new TsEnumType(() => ({enum: Node, changeCase: CaseStyle.KebabCase}));

  const items: TypedValue[] = [
    {
      name: "Node.Expression",
      value: Node.Expression,
      valid: true,
    },
    {
      name: "Node.BinaryOperator",
      value: Node.BinaryOperator,
      valid: true,
    },
    {
      name: "Node.BlockStatement",
      value: Node.BlockStatement,
      valid: true,
    },
    {
      name: "Symbol(Expression)",
      value: Expression,
      valid: true
    },
    {
      name: "Symbol(BinaryOperator)",
      value: BinaryOperator,
      valid: true,
    },
    {
      name: "Symbol(BlockStatement)",
      value: BlockStatement,
      valid: true,
    },
  ];

  runTests($Node, items);
});
