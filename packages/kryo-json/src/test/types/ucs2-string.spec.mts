import {describe} from "node:test";

import {Ucs2StringType} from "kryo/ucs2-string";
import type {TestItem} from "kryo-testing";
import {registerErrMochaTests, registerMochaSuites} from "kryo-testing";

import {JSON_READER} from "../../lib/json-reader.mts";
import {JSON_WRITER} from "../../lib/json-writer.mts";

describe("kryo-json | Ucs2StringType", function () {
  describe("Ucs2StringType({maxLength: 15})", function () {
    const $String50: Ucs2StringType = new Ucs2StringType({maxLength: 15});

    const items: TestItem[] = [
      {
        value: "",
        io: [
          {writer: JSON_WRITER, reader: JSON_READER, raw: "\"\""},
        ],
      },
      {
        value: "Hello World!",
        io: [
          {writer: JSON_WRITER, reader: JSON_READER, raw: "\"Hello World!\""},
        ],
      },
      {
        value: "ԂЯØǷ Łƕ੬ ɃɅϨϞ",
        io: [
          {writer: JSON_WRITER, reader: JSON_READER, raw: "\"ԂЯØǷ Łƕ੬ ɃɅϨϞ\""},
        ],
      },
      {
        value: "0",
        io: [
          {writer: JSON_WRITER, reader: JSON_READER, raw: "\"0\""},
        ],
      },
      {
        value: "1",
        io: [
          {writer: JSON_WRITER, reader: JSON_READER, raw: "\"1\""},
        ],
      },
      {
        value: "null",
        io: [
          {writer: JSON_WRITER, reader: JSON_READER, raw: "\"null\""},
        ],
      },
      {
        value: "true",
        io: [
          {writer: JSON_WRITER, reader: JSON_READER, raw: "\"true\""},
        ],
      },
      {
        value: "false",
        io: [
          {writer: JSON_WRITER, reader: JSON_READER, raw: "\"false\""},
        ],
      },
      {
        value: "undefined",
        io: [
          {writer: JSON_WRITER, reader: JSON_READER, raw: "\"undefined\""},
        ],
      },
      {
        value: "NaN",
        io: [
          {writer: JSON_WRITER, reader: JSON_READER, raw: "\"NaN\""},
        ],
      },
      {
        value: "Infinity",
        io: [
          {writer: JSON_WRITER, reader: JSON_READER, raw: "\"Infinity\""},
        ],
      },
      {
        value: "-Infinity",
        io: [
          {writer: JSON_WRITER, reader: JSON_READER, raw: "\"-Infinity\""},
        ],
      },
      {
        value: "0123456789abcde",
        io: [
          {writer: JSON_WRITER, reader: JSON_READER, raw: "\"0123456789abcde\""},
        ],
      },
    ];

    registerMochaSuites($String50, items);

    describe("Reader", function () {
      const invalids: string[] = [
        "null",
        "true",
        "false",
        "",
        "0",
        "1",
        "0.5",
        "0.0001",
        "2.220446049250313e-16",
        "9007199254740991",
        "-9007199254740991",
        "\"0123456789abcdef\"",
        "[]",
        "{}",
        "\"1970-01-01T00:00:00.000Z\"",
      ];
      registerErrMochaTests(JSON_READER, $String50, invalids);
    });
  });
});
