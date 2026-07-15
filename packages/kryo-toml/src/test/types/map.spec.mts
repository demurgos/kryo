import {describe} from "node:test";

import {IntegerType} from "kryo/integer";
import {MapType} from "kryo/map";
import {Ucs2StringType} from "kryo/ucs2-string";
import type {TestItem} from "kryo-testing";
import {registerErrMochaTests, registerMochaSuites} from "kryo-testing";

import {TOML_READER} from "../../lib/toml-reader.mts";
import {TOML_WRITER} from "../../lib/toml-writer.mts";

describe("kryo-toml | Map", function () {
  describe("IntMap", function () {
    const $IntMap: MapType<number, number> = new MapType({
      keyType: new IntegerType(),
      valueType: new IntegerType(),
      maxSize: 5,
    });

    const items: TestItem[] = [
      {
        value: new Map([[1, 100], [2, 200]]),
        io: [
          {writer: TOML_WRITER, reader: TOML_READER, raw: "1 = 100\n2 = 200\n"},
        ],
      },
      {
        value: new Map(),
        io: [
          {writer: TOML_WRITER, reader: TOML_READER, raw: "\n"},
        ],
      },
    ];

    registerMochaSuites($IntMap, items);

    describe("Reader", function () {
      const invalids: string[] = [
        "null",
        "true",
        "false",
        "0",
        "1",
        "0.5",
        "0.0001",
        "2.220446049250313e-16",
        "9007199254740991",
        "-9007199254740991",
        "\"\"",
        "\"0\"",
        "\"1\"",
        "\"null\"",
        "\"true\"",
        "\"false\"",
        "\"undefined\"",
        "\"NaN\"",
        "\"Infinity\"",
        "\"-Infinity\"",
        "\"foo\"",
        "[]",
        "[[1,100],[2,200]]",
        "\"1970-01-01T00:00:00.000Z\"",
      ];
      registerErrMochaTests(TOML_READER, $IntMap, invalids);
    });
  });

  describe("StringMap", function () {
    const $StringMap: MapType<string, number> = new MapType({
      keyType: new Ucs2StringType({pattern: /^a+$/, maxLength: 10}),
      valueType: new IntegerType(),
      maxSize: 5,
      assumeStringKey: true,
    });

    const items: TestItem[] = [
      {
        value: new Map([["a", 100], ["aa", 200]]),
        io: [
          {writer: TOML_WRITER, reader: TOML_READER, raw: "a = 100\naa = 200\n"},
        ],
      },
      {
        value: new Map(),
        io: [
          {writer: TOML_WRITER, reader: TOML_READER, raw: "\n"},
        ],
      },
    ];

    registerMochaSuites($StringMap, items);

    describe("Reader", function () {
      const invalids: string[] = [
        "null",
        "true",
        "false",
        "0",
        "1",
        "0.5",
        "0.0001",
        "2.220446049250313e-16",
        "9007199254740991",
        "-9007199254740991",
        "\"\"",
        "\"0\"",
        "\"1\"",
        "\"null\"",
        "\"true\"",
        "\"false\"",
        "\"undefined\"",
        "\"NaN\"",
        "\"Infinity\"",
        "\"-Infinity\"",
        "\"foo\"",
        "[]",
        "[[\"a\",100],[\"aa\",200]]",
        "\"1970-01-01T00:00:00.000Z\"",
      ];
      registerErrMochaTests(TOML_READER, $StringMap, invalids);
    });
  });
});
