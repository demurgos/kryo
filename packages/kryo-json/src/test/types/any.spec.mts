import * as assert from "node:assert/strict";
import {describe, test} from "node:test";

import {readOrThrow} from "kryo";
import {AnyType} from "kryo/any";
import type {RecordIoType} from "kryo/record";
import {RecordType} from "kryo/record";

import {JsonReader} from "../../lib/json-reader.mts";
import type {JsonValue} from "../../lib/json-value.mts";
import {JsonValueReader} from "../../lib/json-value-reader.mts";

describe("kryo-json | Any", function () {
  describe("with JsonReader", function () {
    test("should read the expected top-level values", function () {
      const reader: JsonReader = new JsonReader();
      const $Any: AnyType = new AnyType();
      assert.deepStrictEqual(readOrThrow($Any, reader, "0"), "0");
      assert.deepStrictEqual(readOrThrow($Any, reader, "{\"foo\": \"bar\""), "{\"foo\": \"bar\"");
    });
    test("should read the expected nested values", function () {
      const reader: JsonReader = new JsonReader();
      const $Any: AnyType = new AnyType();

      interface FooBarQuz {
        foo: JsonValue;
      }

      const $FooBarQuz: RecordIoType<FooBarQuz> = new RecordType({
        properties: {foo: {type: $Any}},
      });

      assert.deepStrictEqual(readOrThrow($FooBarQuz, reader, "{\"foo\": {\"bar\": \"quz\"}}"), {
        __proto__: null,
        foo: {bar: "quz"}
      });
    });
  });

  describe("with JsonValueReader", function () {
    test("should read the expected values", function () {
      const reader: JsonValueReader = new JsonValueReader();
      const $Any: AnyType = new AnyType();
      assert.deepStrictEqual(readOrThrow($Any, reader, 0), 0);
      assert.deepStrictEqual(readOrThrow($Any, reader, {foo: "bar"}), {foo: "bar"});
    });
  });
});
