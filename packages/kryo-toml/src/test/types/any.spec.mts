import * as assert from "node:assert/strict";
import {describe, test} from "node:test";

import {readOrThrow} from "kryo";
import {AnyType} from "kryo/any";
import {type RecordIoType,RecordType} from "kryo/record";

import {TOML_READER} from "../../lib/toml-reader.mts";
import type {TomlValue} from "../../lib/toml-value.mts";
import {TOML_VALUE_READER} from "../../lib/toml-value-reader.mts";

describe("kryo-toml | Any", function () {
  describe("with TomlReader", function () {
    test("should read the expected top-level values", function () {
      const $Any: AnyType = new AnyType();
      assert.deepStrictEqual(readOrThrow($Any, TOML_READER, "'' = 0\n"), 0);
      assert.deepStrictEqual(readOrThrow($Any, TOML_READER, "'' = {\"foo\" = \"bar\"}\n"), Object.assign(Object.create(null), {
        foo: "bar"
      }));
      assert.deepStrictEqual(readOrThrow($Any, TOML_READER, "'' = {\"foo\" = [1, 2, 3]}\n"), Object.assign(Object.create(null), {
        foo: [1, 2, 3]
      }));
      assert.deepStrictEqual(readOrThrow($Any, TOML_READER, "'' = [1, 2, 3]\n"), [1, 2, 3]);
    });
    test("should read the expected nested values", function () {
      const $Any: AnyType = new AnyType();

      interface FooBarQuz {
        foo: TomlValue;
      }

      const $FooBarQuz: RecordIoType<FooBarQuz> = new RecordType({
        properties: {foo: {type: $Any}},
      });

      assert.deepStrictEqual(
        readOrThrow(
          $FooBarQuz,
          TOML_READER,
          "foo = {bar = \"quz\"}\n",
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
      assert.deepStrictEqual(readOrThrow($Any, TOML_VALUE_READER, 0), 0);
      assert.deepStrictEqual(readOrThrow($Any, TOML_VALUE_READER, {foo: "bar"}), Object.assign(Object.create(null), {
        foo: "bar"
      }));
    });
  });
});
