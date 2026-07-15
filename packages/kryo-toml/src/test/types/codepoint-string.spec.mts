import {describe} from "node:test";

import {UsvStringType} from "kryo/usv-string";
import type {TestItem} from "kryo-testing";
import {registerErrMochaTests, registerMochaSuites} from "kryo-testing";

import {TOML_READER} from "../../lib/toml-reader.mts";
import {TOML_WRITER} from "../../lib/toml-writer.mts";

describe("kryo-toml | CodepointString", function () {
  const type: UsvStringType = new UsvStringType({maxCodepoints: 500});

  const items: TestItem[] = [
    {
      value: "",
      io: [
        {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"\"\n"},
      ],
    },
    {
      value: "Hello World!",
      io: [
        {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"Hello World!\"\n"},
      ],
    },
    {
      value: "ԂЯØǷ Łƕ੬ ɃɅϨϞ",
      io: [
        {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"ԂЯØǷ Łƕ੬ ɃɅϨϞ\"\n"},
      ],
    },
    {
      value: "1970-01-01T00:00:00.000Z",
      io: [
        {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"1970-01-01T00:00:00.000Z\"\n"},
      ],
    },
  ];

  registerMochaSuites(type, items);

  describe("Reader", function () {
    const invalids: string[] = [
      "0.5",
      "0.0001",
      "null",
      "true",
      "false",
      "[]",
      "{}",
      "",
      "\"\udd1e\ud834\"",
    ];
    registerErrMochaTests(TOML_READER, type, invalids);
  });
});
