import {describe} from "node:test";

import {IntegerType} from "kryo/integer";
import type {TestItem} from "kryo-testing";
import {registerErrMochaTests, registerMochaSuites} from "kryo-testing";

import {SEARCH_PARAMS_READER} from "../../lib/search-params-reader.mts";
import {SEARCH_PARAMS_WRITER} from "../../lib/search-params-writer.mts";

describe("kryo-search-params | Integer", function () {
  describe("Main", function () {
    const $Integer: IntegerType = new IntegerType();

    const items: TestItem[] = [
      {
        name: "0",
        value: 0,
        io: [
          {writer: SEARCH_PARAMS_WRITER, reader: SEARCH_PARAMS_READER, raw: "_=0"},
        ],
      },
      {
        name: "1",
        value: 1,
        io: [
          {writer: SEARCH_PARAMS_WRITER, reader: SEARCH_PARAMS_READER, raw: "_=1"},
        ],
      },
      {
        name: "-1",
        value: -1,
        io: [
          {writer: SEARCH_PARAMS_WRITER, reader: SEARCH_PARAMS_READER, raw: "_=-1"},
        ],
      },
      {
        name: "2",
        value: 2,
        io: [
          {writer: SEARCH_PARAMS_WRITER, reader: SEARCH_PARAMS_READER, raw: "_=2"},
        ],
      },
      {
        name: "1e3",
        value: 1e3,
        io: [
          {writer: SEARCH_PARAMS_WRITER, reader: SEARCH_PARAMS_READER, raw: "_=1000"},
        ],
      },
      {
        name: "-1e3",
        value: -1e3,
        io: [
          {writer: SEARCH_PARAMS_WRITER, reader: SEARCH_PARAMS_READER, raw: "_=-1000"},
        ],
      },
      {
        name: "Number.MAX_SAFE_INTEGER",
        value: Number.MAX_SAFE_INTEGER,
        io: [
          {writer: SEARCH_PARAMS_WRITER, reader: SEARCH_PARAMS_READER, raw: "_=9007199254740991"},
        ],
      },
      {
        name: "Number.MAX_SAFE_INTEGER - 1",
        value: Number.MAX_SAFE_INTEGER - 1,
        io: [
          {writer: SEARCH_PARAMS_WRITER, reader: SEARCH_PARAMS_READER, raw: "_=9007199254740990"},
        ],
      },
      {
        name: "Number.MIN_SAFE_INTEGER",
        value: Number.MIN_SAFE_INTEGER,
        io: [
          {writer: SEARCH_PARAMS_WRITER, reader: SEARCH_PARAMS_READER, raw: "_=-9007199254740991"},
        ],
      },
      {
        name: "Number.MIN_SAFE_INTEGER - 1",
        value: Number.MIN_SAFE_INTEGER - 1,
        io: [
          {writer: SEARCH_PARAMS_WRITER, reader: SEARCH_PARAMS_READER, raw: "_=-9007199254740992"},
        ],
      },
      {
        name: "Number.MIN_SAFE_INTEGER + 1",
        value: Number.MIN_SAFE_INTEGER + 1,
        io: [
          {writer: SEARCH_PARAMS_WRITER, reader: SEARCH_PARAMS_READER, raw: "_=-9007199254740990"},
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
        "9007199254740992", // Number.MAX_SAFE_INTEGER + 1
        "-9007199254740993", // Number.MIN_SAFE_INTEGER - 2
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
      registerErrMochaTests(SEARCH_PARAMS_READER, $Integer, invalids);
    });
  });
});
