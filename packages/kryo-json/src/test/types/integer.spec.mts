import {describe} from "node:test";

import {IntegerType} from "kryo/integer";
import type {TestItem} from "kryo-testing";
import {registerErrMochaTests, registerMochaSuites} from "kryo-testing";

import {JSON_READER} from "../../lib/json-reader.mts";
import {JSON_WRITER} from "../../lib/json-writer.mts";

describe("kryo-json | Integer", function () {
  describe("Main", function () {
    const $Integer: IntegerType = new IntegerType();

    const items: TestItem[] = [
      {
        name: "0",
        value: 0,
        io: [
          {writer: JSON_WRITER, reader: JSON_READER, raw: "0"},
        ],
      },
      {
        name: "1",
        value: 1,
        io: [
          {writer: JSON_WRITER, reader: JSON_READER, raw: "1"},
        ],
      },
      {
        name: "-1",
        value: -1,
        io: [
          {writer: JSON_WRITER, reader: JSON_READER, raw: "-1"},
        ],
      },
      {
        name: "2",
        value: 2,
        io: [
          {writer: JSON_WRITER, reader: JSON_READER, raw: "2"},
        ],
      },
      {
        name: "1e3",
        value: 1e3,
        io: [
          {writer: JSON_WRITER, reader: JSON_READER, raw: "1000"},
        ],
      },
      {
        name: "-1e3",
        value: -1e3,
        io: [
          {writer: JSON_WRITER, reader: JSON_READER, raw: "-1000"},
        ],
      },
      {
        name: "Number.MIN_SAFE_INTEGER - 1", // -(2**53)
        value: Number.MIN_SAFE_INTEGER - 1,
        io: [
          {writer: JSON_WRITER, reader: JSON_READER, raw: "-9007199254740992"},
          // todo: this case should be rejected instead of silently changing the value!
          {reader: JSON_READER, raw: "-9007199254740993"}, // `JSON.parse` reads `-(2**53) - 1` as `-(2**53)`
        ],
      },
      {
        name: "Number.MIN_SAFE_INTEGER", // -(2**53) + 1
        value: Number.MIN_SAFE_INTEGER,
        io: [
          {writer: JSON_WRITER, reader: JSON_READER, raw: "-9007199254740991"},
        ],
      },
      {
        name: "Number.MIN_SAFE_INTEGER + 1", // -(2**53) + 2
        value: Number.MIN_SAFE_INTEGER + 1,
        io: [
          {writer: JSON_WRITER, reader: JSON_READER, raw: "-9007199254740990"},
        ],
      },
      {
        name: "Number.MAX_SAFE_INTEGER - 1", // +2**53 - 2
        value: Number.MAX_SAFE_INTEGER - 1,
        io: [
          {writer: JSON_WRITER, reader: JSON_READER, raw: "9007199254740990"},
        ],
      },
      {
        name: "Number.MAX_SAFE_INTEGER", // +2**53 - 1
        value: Number.MAX_SAFE_INTEGER,
        io: [
          {writer: JSON_WRITER, reader: JSON_READER, raw: "9007199254740991"},
        ],
      },
    ];

    registerMochaSuites($Integer, items);

    describe("Reader", function () {
      const invalids: string[] = [
        "null",
        "true",
        "false",
        "",
        "0.5",
        "0.0001",
        "2.220446049250313e-16",
        "-9007199254740994", // Number.MIN_SAFE_INTEGER - 3, -(2**53) - 2
        // `-(2**53) - 1` is not tested here since `JSON.parse` reads it as `-(2**53)`
        // "-9007199254740993",
        "9007199254740992", // Number.MAX_SAFE_INTEGER + 1, +2**53
        "\"\"",
        "\"0\"",
        "\"null\"",
        "\"true\"",
        "\"false\"",
        "\"NaN\"",
        "\"Infinity\"",
        "\"-Infinity\"",
        "[]",
        "{}",
        "\"1970-01-01T00:00:00.000Z\"",
      ];
      registerErrMochaTests(JSON_READER, $Integer, invalids);
    });
  });
});
