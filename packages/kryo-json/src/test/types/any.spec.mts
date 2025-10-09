import * as assert from "node:assert/strict";
import {describe, test} from "node:test";

import {readOrThrow} from "kryo";
import {AnyType} from "kryo/any";
import {type RecordIoType, RecordType} from "kryo/record";

import {JSON_READER} from "../../lib/json-reader.mts";
import type {JsonValue} from "../../lib/json-value.mts";
import {JSON_VALUE_READER} from "../../lib/json-value-reader.mts";

describe("kryo-json | Any", function () {
  describe("with JsonReader", function () {
    test("should read the expected top-level values", function () {
      const $Any: AnyType = new AnyType();
      assert.deepStrictEqual(readOrThrow($Any, JSON_READER, "0"), 0);
      assert.deepStrictEqual(readOrThrow($Any, JSON_READER, "{\"foo\": \"bar\"}"), Object.assign(Object.create(null), {
        foo: "bar"
      }));
      assert.deepStrictEqual(readOrThrow($Any, JSON_READER, "{\"foo\": [1, 2, 3]}"), Object.assign(Object.create(null), {
        foo: [1, 2, 3]
      }));
      assert.deepStrictEqual(readOrThrow($Any, JSON_READER, "[1, 2, 3]"), [1, 2, 3]);
      assert.deepStrictEqual(readOrThrow($Any, JSON_READER, "null"), null);
    });
    test("should read the expected nested values", function () {
      const $Any: AnyType = new AnyType();

      interface FooBarQuz {
        foo: JsonValue;
      }

      const $FooBarQuz: RecordIoType<FooBarQuz> = new RecordType({
        properties: {foo: {type: $Any}},
      });

      assert.deepStrictEqual(
        readOrThrow(
          $FooBarQuz,
          JSON_READER,
          "{\"foo\": {\"bar\": \"quz\"}}",
        ),
        Object.assign(Object.create(null), {
          foo: Object.assign(Object.create(null), {
            bar: "quz"
          }),
        }),
      );
    });
  });

  describe("with JsonValueReader", function () {
    test("should read the expected values", function () {
      const $Any: AnyType = new AnyType();
      assert.deepStrictEqual(readOrThrow($Any, JSON_VALUE_READER, 0), 0);
      assert.deepStrictEqual(readOrThrow($Any, JSON_VALUE_READER, {foo: "bar"}), Object.assign(Object.create(null), {
        foo: "bar"
      }));
    });
  });
});
