import {describe} from "node:test";

import {BooleanType} from "kryo/boolean";
import type {TestItem} from "kryo-testing";
import {registerErrMochaTests, registerMochaSuites} from "kryo-testing";

import {QsReader} from "../../lib/qs-reader.mts";
import {QsWriter} from "../../lib/qs-writer.mts";

describe("kryo-qs | Boolean", function () {
  const QS_READER: QsReader = new QsReader();
  const QS_WRITER: QsWriter = new QsWriter();

  const type: BooleanType = new BooleanType();

  const items: TestItem[] = [
    {name: "true", value: true, io: [{writer: QS_WRITER, reader: QS_READER, raw: "_=true"}]},
    {name: "false", value: false, io: [{writer: QS_WRITER, reader: QS_READER, raw: "_=false"}]},
  ];

  registerMochaSuites(type, items);

  describe("Reader", function () {
    const invalids: string[] = [
      "1",
      "\"on\"",
      "\"true\"",
    ];
    registerErrMochaTests(QS_READER, type, invalids);
  });
});
