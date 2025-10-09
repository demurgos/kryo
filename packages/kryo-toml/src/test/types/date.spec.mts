import {describe} from "node:test";

import {DateType} from "kryo/date";
import type {TestItem} from "kryo-testing";
import {registerErrMochaTests, registerMochaSuites} from "kryo-testing";

import {TOML_READER} from "../../lib/toml-reader.mts";
import {TOML_WRITER} from "../../lib/toml-writer.mts";

describe("kryo-toml | Date", function () {
  const type: DateType = new DateType();

  const items: TestItem[] = [
    {
      name: "new Date(0)",
      value: new Date(0),
      io: [
        {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = 1970-01-01T00:00:00.000Z"},
        {reader: TOML_READER, raw: "\"\" = \"1970-01-01T00:00:00.000Z\""},
        {reader: TOML_READER, raw: "\"\" = 0"},
      ],
    },
    {
      name: "new Date(1)",
      value: new Date(1),
      io: [
        {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = 1970-01-01T00:00:00.001Z"},
        {reader: TOML_READER, raw: "\"\" = \"1970-01-01T00:00:00.001Z\""},
        {reader: TOML_READER, raw: "\"\" = 1"},
      ],
    },
    {
      name: "new Date(\"1247-05-18T19:40:08.418Z\")",
      value: new Date("1247-05-18T19:40:08.418Z"),
      io: [
        {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = 1247-05-18T19:40:08.418Z"},
      ],
    },
    {
      name: "new Date(Number.EPSILON)",
      value: new Date(Number.EPSILON),
      io: [
        {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = 1970-01-01T00:00:00.000Z"},
      ],
    },
    {
      name: "new Date(Math.PI)",
      value: new Date(Math.PI),
      io: [
        {writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = 1970-01-01T00:00:00.003Z"},
      ],
    },
  ];

  registerMochaSuites(type, items);

  describe("Reader", function () {
    const invalids: string[] = [
      "null",
      "\"\"",
      "\"0\"",
      "\"true\"",
      "\"false\"",
      "true",
      "false",
      "[]",
      "{}",
    ];
    registerErrMochaTests(TOML_READER, type, invalids);
  });
});
