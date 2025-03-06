import * as assert from "node:assert/strict";
import {describe, test} from "node:test";

import {readOrThrow} from "kryo";
import {$Any, AnyType} from "kryo/any";
import type {RecordIoType} from "kryo/record";
import {RecordType} from "kryo/record";

import {SEARCH_PARAMS_READER} from "../../lib/search-params-reader.mts";
import {SEARCH_PARAMS_VALUE_READER} from "../../lib/search-params-value-reader.mts";

describe("kryo-search-params | Any", function () {
  describe("with JsonReader", function () {
    test("should read the expected top-level values", function () {
      const $Any: AnyType = new AnyType();
      assert.deepStrictEqual(readOrThrow($Any, SEARCH_PARAMS_READER, "0"), "0");
      assert.deepStrictEqual(readOrThrow($Any, SEARCH_PARAMS_READER, "foo=bar"), "foo=bar");
    });
    test("should read the expected nested values", function () {
      const $Any: AnyType = new AnyType();

      interface FooBarQuz {
        foo: unknown;
      }

      const $FooBarQuz: RecordIoType<FooBarQuz> = new RecordType({
        properties: {foo: {type: $Any}},
      });

      assert.deepStrictEqual(readOrThrow($FooBarQuz, SEARCH_PARAMS_READER, "foo={\"bar\":\"quz\"}"), {
        __proto__: null,
        foo: "{\"bar\":\"quz\"}"
      });
    });
  });

  describe("with JsonValueReader", function () {
    test("should read the expected values", function () {
      assert.deepStrictEqual(readOrThrow($Any, SEARCH_PARAMS_VALUE_READER, "0"), "0");
      assert.deepStrictEqual(readOrThrow($Any, SEARCH_PARAMS_VALUE_READER, "{\"foo\": \"bar\"}"), "{\"foo\": \"bar\"}");
    });
  });
});
