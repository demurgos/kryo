import {describe} from "node:test";

import {Ucs2StringType} from "kryo/ucs2-string";
import type {TestItem} from "kryo-testing";
import {registerErrMochaTests, registerMochaSuites} from "kryo-testing";

import {TOML_READER} from "../../lib/toml-reader.mts";
import {TOML_WRITER} from "../../lib/toml-writer.mts";

describe("kryo-toml | Ucs2StringType", function () {
  describe("Ucs2StringType({maxLength: 15})", function () {
    const $String50: Ucs2StringType = new Ucs2StringType({maxLength: 15});

    const items: TestItem[] = [
      {
        value: "",
        io: [
          {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"\""},
        ],
      },
      {
        value: "Hello World!",
        io: [
          {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"Hello World!\""},
        ],
      },
      {
        value: "ԂЯØǷ Łƕ੬ ɃɅϨϞ",
        io: [
          {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"ԂЯØǷ Łƕ੬ ɃɅϨϞ\""},
        ],
      },
      {
        value: "0",
        io: [
          {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"0\""},
        ],
      },
      {
        value: "1",
        io: [
          {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"1\""},
        ],
      },
      {
        value: "null",
        io: [
          {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"null\""},
        ],
      },
      {
        value: "true",
        io: [
          {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"true\""},
        ],
      },
      {
        value: "false",
        io: [
          {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"false\""},
        ],
      },
      {
        value: "undefined",
        io: [
          {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"undefined\""},
        ],
      },
      {
        value: "NaN",
        io: [
          {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"NaN\""},
        ],
      },
      {
        value: "Infinity",
        io: [
          {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"Infinity\""},
        ],
      },
      {
        value: "-Infinity",
        io: [
          {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"-Infinity\""},
        ],
      },
      {
        value: "0123456789abcde",
        io: [
          {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"0123456789abcde\""},
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
      registerErrMochaTests(TOML_READER, $String50, invalids);
    });
  });
});
