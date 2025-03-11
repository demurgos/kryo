import {describe} from "node:test";

import { UsvStringType } from "kryo/usv-string";
import type {TestItem} from "kryo-testing";
import {registerErrMochaTests, registerMochaSuites} from "kryo-testing";

import { QsReader } from "../../lib/qs-reader.mts";
import { QsWriter } from "../../lib/qs-writer.mts";

describe("kryo-qs | CodepointString", function () {
  const QS_READER: QsReader = new QsReader();
  const QS_WRITER: QsWriter = new QsWriter();

  const type: UsvStringType = new UsvStringType({maxCodepoints: 500});

  const items: TestItem[] = [
    {
      value: "",
      io: [
        {writer: QS_WRITER, reader: QS_READER, raw: "_="},
      ],
    },
    {
      value: "Hello World!",
      io: [
        {writer: QS_WRITER, reader: QS_READER, raw: "_=Hello%20World%21"},
        {reader: QS_READER, raw: "_=Hello World!"},
      ],
    },
    {
      value: "ԂЯØǷ Łƕ੬ ɃɅϨϞ",
      io: [
        {writer: QS_WRITER, reader: QS_READER, raw: "_=%D4%82%D0%AF%C3%98%C7%B7%20%C5%81%C6%95%E0%A9%AC%20%C9%83%C9%85%CF%A8%CF%9E"},
        {reader: QS_READER, raw: "_=ԂЯØǷ Łƕ੬ ɃɅϨϞ"},
      ],
    },
    {
      value: "1970-01-01T00:00:00.000Z",
      io: [
        {writer: QS_WRITER, reader: QS_READER, raw: "_=1970-01-01T00%3A00%3A00.000Z"},
        {reader: QS_READER, raw: "_=1970-01-01T00:00:00.000Z"},
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
    registerErrMochaTests(QS_READER, type, invalids);
  });
});
