import * as assert from "node:assert/strict";
import {describe, test} from "node:test";

import {readOrThrow} from "kryo";
import {AnyType} from "kryo/any";
import type {RecordIoType} from "kryo/record";
import {RecordType} from "kryo/record";

import {QsReader} from "../../lib/qs-reader.mts";
import type {QsValue} from "../../lib/qs-value.mjs";
import {QsValueReader} from "../../lib/qs-value-reader.mts";

describe("kryo-qs | Any", function () {
  describe("with JsonReader", function () {
    test("should read the expected top-level values", function () {
      const reader: QsReader = new QsReader();
      const $Any: AnyType = new AnyType();
      assert.deepStrictEqual(readOrThrow($Any, reader, "0"), "0");
      assert.deepStrictEqual(readOrThrow($Any, reader, "foo=bar"), "foo=bar");
    });
    test("should read the expected nested values", function () {
      const reader: QsReader = new QsReader();
      const $Any: AnyType = new AnyType();

      interface FooBarQuz {
        foo: QsValue;
      }

      const $FooBarQuz: RecordIoType<FooBarQuz> = new RecordType({
        properties: {foo: {type: $Any}},
      });

      assert.deepStrictEqual(readOrThrow($FooBarQuz, reader, "foo[bar]=quz"), {__proto__: null, foo: {bar: "quz"}});
    });
  });

  describe("with JsonValueReader", function () {
    test("should read the expected values", function () {
      const reader: QsValueReader = new QsValueReader();
      const $Any: AnyType = new AnyType();
      assert.deepStrictEqual(readOrThrow($Any, reader, "Hello"), "Hello");
      assert.deepStrictEqual(readOrThrow($Any, reader, {foo: "bar"}), {foo: "bar"});
    });
  });
});
