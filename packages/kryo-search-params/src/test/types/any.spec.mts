import * as assert from "node:assert/strict";
import {describe, test} from "node:test";

import {readOrThrow} from "kryo";
import {$Any} from "kryo/any";
import {type RecordIoType, RecordType} from "kryo/record";

import {SEARCH_PARAMS_READER} from "../../lib/search-params-reader.mts";
import {SEARCH_PARAMS_VALUE_READER} from "../../lib/search-params-value-reader.mts";

describe("kryo-search-params | Any", function () {
  describe("with SearchParamsReader", function () {
    test("should read the expected top-level values", function () {
      assert.deepStrictEqual(readOrThrow($Any, SEARCH_PARAMS_READER, "_=0"), 0);
      assert.deepStrictEqual(readOrThrow($Any, SEARCH_PARAMS_READER, "_={\"foo\": \"bar\"}"), Object.assign(Object.create(null), {
        foo: "bar"
      }));
    });
    test("should read the expected nested values", function () {
      interface FooBarQuz {
        foo: unknown;
      }

      const $FooBarQuz: RecordIoType<FooBarQuz> = new RecordType({
        properties: {foo: {type: $Any}},
      });

      assert.deepStrictEqual(
        readOrThrow($FooBarQuz, SEARCH_PARAMS_READER, "foo={\"bar\":\"quz\"}"),
        Object.assign(Object.create(null), {
          foo: Object.assign(Object.create(null), {
            bar: "quz"
          }),
        })
      );
    });
  });

  describe("with SearchParamsValueReader", function () {
    test("should read the expected values", function () {
      assert.deepStrictEqual(readOrThrow($Any, SEARCH_PARAMS_VALUE_READER, "0"), 0);
      assert.deepStrictEqual(readOrThrow($Any, SEARCH_PARAMS_VALUE_READER, "{\"foo\": \"bar\"}"), Object.assign(Object.create(null), {
        foo: "bar",
      }));
    });
  });
});
