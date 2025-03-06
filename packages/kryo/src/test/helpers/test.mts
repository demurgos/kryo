import * as assert from "node:assert/strict";
import {describe, test} from "node:test";

import type {Type} from "../../lib/index.mts";
import {NOOP_CONTEXT} from "../../lib/index.mts";

export interface NamedValue {
  name?: string;
  value: unknown;
}

export interface CheckedValue extends NamedValue {
  valid: boolean;
}

export interface InvalidTypedValue extends CheckedValue {
  valid: boolean;
  testError?: Error;
}

export interface ValidTypedValue extends CheckedValue {
  valid: boolean;

  output?: {
    [formatName: string]: unknown;
  };

  inputs?: {
    [formatName: string]: unknown;
  };

  invalidInputs?: {
    [formatName: string]: unknown;
  };
}

export type TypedValue = InvalidTypedValue | ValidTypedValue;

function getName(namedValue: NamedValue) {
  return "name" in namedValue ? namedValue.name : JSON.stringify(namedValue.value);
}

export function testInvalidValue(type: Type<unknown>, item: InvalidTypedValue) {
  test("Should return `ResultErr` for .test", function () {
    assert.strictEqual(type.test(NOOP_CONTEXT, item.value).ok, false);
  });
}

export function testValidValue(type: Type<unknown>, item: ValidTypedValue) {
  test("Should return `ResultOk` for .test", function () {
    assert.strictEqual(type.test(NOOP_CONTEXT, item.value).ok, true);
  });
}

export function testValueSync(type: Type<unknown>, item: TypedValue): void {
  if (item.valid) {
    testValidValue(type, item);
  } else {
    testInvalidValue(type, item);
  }
}

export function runTests(type: Type<unknown>, items: TypedValue[]): void {
  for (const item of items) {
    describe(`Item: ${getName(item)}`, function () {
      testValueSync(type, item);
    });
  }
}
