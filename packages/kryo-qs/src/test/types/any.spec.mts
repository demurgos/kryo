import * as assert from "node:assert/strict";
import {describe, test} from "node:test";

import {readOrThrow} from "kryo";
import {$Any} from "kryo/any";
import {type RecordIoType, RecordType} from "kryo/record";

import {QS_READER} from "../../lib/qs-reader.mts";
import type {QsValue} from "../../lib/qs-value.mts";
import {QS_VALUE_READER} from "../../lib/qs-value-reader.mts";

describe("kryo-qs | Any", function () {
  describe("with QsReader", function () {
    describe("should read the expected top-level values", function () {
      test("_=0", function () {
        assert.deepStrictEqual(readOrThrow($Any, QS_READER, "_=0"), "0");
      });
      test("foo=bar", function () {
        assert.deepStrictEqual(readOrThrow($Any, QS_READER, "_[foo]=bar"), Object.assign(Object.create(null), {
          foo: "bar"
        }));
      });
    });
    test("should read the expected nested values", function () {
      interface FooBarQuz {
        foo: QsValue;
      }

      const $FooBarQuz: RecordIoType<FooBarQuz> = new RecordType({
        properties: {foo: {type: $Any}},
      });

      assert.deepStrictEqual(
        readOrThrow($FooBarQuz, QS_READER, "foo[bar]=quz"),
        Object.assign(Object.create(null), {
          foo: Object.assign(Object.create(null), {
            bar: "quz"
          }),
        })
      );
    });
  });

  describe("with QsValueReader", function () {
    test("should read the expected values", function () {
      assert.deepStrictEqual(readOrThrow($Any, QS_VALUE_READER, "Hello"), "Hello");
      assert.deepStrictEqual(readOrThrow($Any, QS_VALUE_READER, {foo: "bar"}), Object.assign(Object.create(null), {
        foo: "bar"
      }));
    });
  });
});
