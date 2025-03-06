import * as assert from "node:assert/strict";
import {describe, test} from "node:test";
import * as util from "node:util";

import type {IoType, Reader, Writer} from "kryo";
import {NOOP_CONTEXT, readOrThrow} from "kryo";

export interface TestItem<T = unknown> {
  name?: string;
  value: T;
  io?: IoTestItem[];
}

export interface WriteTestItem<Raw = unknown> {
  writer: Writer<Raw>;
  reader?: Reader<Raw>;
  raw: Raw;
}

export interface ReadWriteTestItem<Raw = unknown> {
  writer: Writer<Raw>;
  reader: Reader<Raw>;
  raw: Raw;
}

export interface ReadTestItem<Raw = unknown> {
  writer?: Writer<Raw>;
  reader: Reader<Raw>;
  raw: Raw;
}

export type IoTestItem<Raw = unknown> = WriteTestItem<Raw> | ReadWriteTestItem<Raw> | ReadTestItem<Raw>;

export function registerErrMochaTests<T = unknown>(
  reader: Reader<unknown>,
  ioType: IoType<T>,
  raws: Iterable<unknown>,
): void {
  for (const raw of raws) {
    test(`rejects: ${util.inspect(raw)}`, function () {
      let readOrThrowError: unknown = null;
      let actualValue: T | null = null;
      try {
        actualValue = readOrThrow(ioType, reader, raw);
      } catch (err: unknown) {
        readOrThrowError = err;
      }
      if (readOrThrowError === null) {
        assert.fail(`expected reader to throw: value=${util.inspect(actualValue)}`);
      } else {
        assert.ok(readOrThrowError instanceof Error);
      }
    });
  }
}

export function registerMochaSuites<T = unknown>(
  ioType: IoType<T>,
  testItems: Iterable<TestItem<T>>,
): void {
  for (const testItem of testItems) {
    registerMochaSuite(ioType, testItem);
  }
}

export function registerMochaSuite<T = unknown>(ioType: IoType<T>, testItem: TestItem<T>): void {
  const name: string = getName(testItem);
  describe(name, function () {
    registerMochaTests(ioType, testItem);
  });
}

export function registerMochaTests<T = unknown>(ioType: IoType<T>, testItem: TestItem<T>): void {
  if (testItem.io === undefined) {
    return;
  }
  for (const ioTest of testItem.io) {
    if (ioTest.writer !== undefined) {
      registerMochaWriteTest(`write: ${util.inspect(ioTest.raw)}`, ioType, testItem.value, ioTest as WriteTestItem);
    }
    if (ioTest.reader !== undefined) {
      registerMochaReadTest(`read: ${util.inspect(ioTest.raw)}`, ioType, testItem.value, ioTest as ReadTestItem);
    }
  }
}

export function registerMochaWriteTest<T = unknown>(
  testName: string,
  ioType: IoType<T>,
  inputValue: T,
  testItem: WriteTestItem,
): void {
  test(testName, function () {
    const actualRaw: typeof testItem.raw = ioType.write(testItem.writer, inputValue);
    assert.deepStrictEqual(actualRaw, testItem.raw);
  });
}

export function registerMochaReadTest<T = unknown>(
  testName: string,
  ioType: IoType<T>,
  expectedValue: T,
  testItem: ReadTestItem,
): void {
  test(testName, function () {
    const actualValue: T = readOrThrow(ioType, testItem.reader, testItem.raw);
    assert.ok(ioType.test(NOOP_CONTEXT, actualValue).ok);
    assert.ok(ioType.equals(actualValue, expectedValue));
  });
}

function getName({name, value}: TestItem) {
  return name ?? util.inspect(value);
}
