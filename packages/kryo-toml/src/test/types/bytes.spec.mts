import {describe} from "node:test";

import {BytesType} from "kryo/bytes";
import type {TestItem} from "kryo-testing";
import {registerErrMochaTests, registerMochaSuites} from "kryo-testing";

import {TOML_READER} from "../../lib/toml-reader.mts";
import {TOML_WRITER} from "../../lib/toml-writer.mts";

describe("kryo-toml | Bytes", function () {
  const shortBuffer: BytesType = new BytesType({
    maxLength: 2,
  });

  const items: TestItem[] = [
    {
      name: "Uint8Array.from([])",
      value: Uint8Array.from([]),
      io: [
        {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"\"\n"},
      ],
    },
    {
      name: "Uint8Array.from([1])",
      value: Uint8Array.from([1]),
      io: [
        {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"01\"\n"},
      ],
    },
    {
      name: "Uint8Array.from([2, 3])",
      value: Uint8Array.from([2, 3]),
      io: [
        {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = \"0203\"\n"},
      ],
    },
  ];

  registerMochaSuites(shortBuffer, items);

  describe("Reader", function () {
    const invalids: string[] = [
      "\"040506\"",
      "[7]",
      "[0.5]",
      "[null]",
      "[]",
      "[0]",
      "[0, 0]",
      "\"1970-01-01T00:00:00.000Z\"",
      "0",
      "1",
      "",
      "\"0\"",
      "\"true\"",
      "\"false\"",
      "null",
      "{}",
    ];
    registerErrMochaTests(TOML_READER, shortBuffer, invalids);
  });
});
