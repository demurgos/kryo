import * as assert from "node:assert/strict";
import {describe, test} from "node:test";

import { Float64Type } from "../../lib/float64.mts";
import type { TypedValue } from "../helpers/test.mts";
import { runTests } from "../helpers/test.mts";

describe("Float64Type", function () {
  const $Float64: Float64Type = new Float64Type();

  const items: TypedValue[] = [
    {
      name: "0",
      value: 0,
      valid: true,
    },
    {name: "1", value: 1, valid: true},
    {name: "-1", value: -1, valid: true},
    {name: "2", value: 2, valid: true},
    {name: "1e3", value: 1e3, valid: true},
    {name: "-1e3", value: 1e3, valid: true},
    {name: "Number.MAX_SAFE_INTEGER", value: Number.MAX_SAFE_INTEGER, valid: true},
    {name: "Number.MIN_SAFE_INTEGER", value: Number.MIN_SAFE_INTEGER, valid: true},
    {name: "Number.MAX_VALUE", value: Number.MAX_VALUE, valid: true},
    {name: "0.5", value: 0.5, valid: true},
    {name: "0.0001", value: 0.0001, valid: true},
    {name: "Number.EPSILON", value: Number.EPSILON, valid: true},

    // tslint:disable-next-line:no-construct
    {name: "new Number(1)", value: new Number(1), valid: false},
    {name: "\"\"", value: "", valid: false},
    {name: "\"0\"", value: "0", valid: false},
    {name: "Infinity", value: Infinity, valid: false},
    {name: "-Infinity", value: -Infinity, valid: false},
    {name: "NaN", value: NaN, valid: false},
    {name: "\"true\"", value: "true", valid: false},
    {name: "\"false\"", value: "false", valid: false},
    {name: "undefined", value: undefined, valid: false},
    {name: "null", value: null, valid: false},
    {name: "[]", value: [], valid: false},
    {name: "{}", value: {}, valid: false},
    {name: "new Date()", value: new Date(), valid: false},
    {name: "/regex/", value: /regex/, valid: false},
  ];

  runTests($Float64, items);

  describe("NaN support", function () {
    const $Float64WithNan: Float64Type = new Float64Type({allowNaN: true});
    const items: TypedValue[] = [
      {name: "0", value: 0, valid: true},
      {name: "1", value: 1, valid: true},
      {name: "NaN", value: NaN, valid: true},

      // tslint:disable-next-line:no-construct
      {name: "new Number(NaN)", value: new Number(NaN), valid: false},
      {name: "Infinity", value: Infinity, valid: false},
      {name: "-Infinity", value: -Infinity, valid: false},
    ];

    runTests($Float64WithNan, items);

    test("Should treat two `NaN` values as equal", function () {
      assert.strictEqual($Float64WithNan.equals(NaN, NaN), true);
    });
  });

  describe("Infinity support", function () {
    const $Float64WithInfinity: Float64Type = new Float64Type({allowInfinity: true});
    const items: TypedValue[] = [
      {name: "0", value: 0, valid: true},
      {name: "1", value: 1, valid: true},
      {name: "Infinity", value: Infinity, valid: true},
      {name: "-Infinity", value: -Infinity, valid: true},

      // tslint:disable-next-line:no-construct
      {name: "new Number(Infinity)", value: new Number(Infinity), valid: false},
      // tslint:disable-next-line:no-construct
      {name: "new Number(-Infinity)", value: new Number(-Infinity), valid: false},
      {name: "NaN", value: NaN, valid: false},
    ];

    runTests($Float64WithInfinity, items);

    test("should return `true` for `.equals(Infinity, Infinity)`", function () {
      assert.strictEqual($Float64WithInfinity.equals(Infinity, Infinity), true);
    });

    test("should return `true` for `.equals(-Infinity, -Infinity)`", function () {
      assert.strictEqual($Float64WithInfinity.equals(-Infinity, -Infinity), true);
    });

    test("should return `false` for `.equals(-Infinity, Infinity)`", function () {
      assert.strictEqual($Float64WithInfinity.equals(-Infinity, Infinity), false);
    });

    test("should return `false` for `.equals(Infinity, -Infinity)`", function () {
      assert.strictEqual($Float64WithInfinity.equals(Infinity, -Infinity), false);
    });
  });

  describe("lte", function () {
    const $Float64: Float64Type = new Float64Type({allowNaN: true, allowInfinity: true});

    interface TestItem {
      left: number;
      right: number;
      expected: boolean;
    }

    const values: number[] = [-Infinity, -1, -0, +0, +1, +Infinity, NaN];
    const testItems: TestItem[] = [];
    for (let i: number = 0; i < values.length; i++) {
      for (let j: number = 0; j < values.length; j++) {
        testItems.push({left: values[i], right: values[j], expected: i <= j});
      }
    }

    for (const {left, right, expected} of testItems) {
      test(`.lte(${left}, ${right}) should return ${expected}`, function () {
        assert.deepStrictEqual($Float64.lte(left, right), expected);
      });
    }
  });
});
