import {describe} from "node:test";

import {CaseStyle} from "kryo";
import {DateType} from "kryo/date";
import {IntegerType} from "kryo/integer";
import type {RecordIoType} from "kryo/record";
import {RecordType} from "kryo/record";
import type {TestItem} from "kryo-testing";
import {registerErrMochaTests, registerMochaSuites} from "kryo-testing";

import {TOML_READER} from "../../lib/toml-reader.mts";
import {TOML_WRITER} from "../../lib/toml-writer.mts";

describe("kryo-toml | Record", function () {
  describe("TestRecord", function () {
    interface TestRecord {
      dateProp: Date;
      optIntProp?: number;
      nestedDoc?: {id?: number};
    }

    const $TestRecord: RecordIoType<TestRecord> = new RecordType({
      noExtraKeys: false,
      properties: {
        dateProp: {
          optional: false,
          type: new DateType(),
        },
        optIntProp: {
          optional: true,
          type: new IntegerType(),
        },
        nestedDoc: {
          optional: true,
          type: new RecordType({
            noExtraKeys: false,
            properties: {
              id: {
                optional: true,
                type: new IntegerType(),
              },
            },
          }),
        },
      },
    });

    const items: TestItem[] = [
      {
        value: {
          dateProp: new Date(0),
          optIntProp: 50,
          nestedDoc: {
            id: 10,
          },
        },
        io: [
          {
            writer: TOML_WRITER,
            reader: TOML_READER,
            raw: "dateProp = 1970-01-01T00:00:00.000Z\noptIntProp = 50\n\n[nestedDoc]\nid = 10",
          },
        ],
      },
      {
        value: {
          dateProp: new Date(0),
          nestedDoc: {
            id: 10,
          },
        },
        io: [
          {
            writer: TOML_WRITER,
            reader: TOML_READER,
            raw: "dateProp = 1970-01-01T00:00:00.000Z\n\n[nestedDoc]\nid = 10",
          },
        ],
      },
    ];

    registerMochaSuites($TestRecord, items);

    describe("Reader", function () {
      const invalids: string[] = [
        "\"1970-01-01T00:00:00.000Z\"",
        "null",
        "0",
        "1",
        "\"\"",
        "\"0\"",
        "\"true\"",
        "\"false\"",
        "true",
        "false",
        "[]",
        "{}",
      ];
      registerErrMochaTests(TOML_READER, $TestRecord, invalids);
    });

  });

  describe("Record: rename", function () {
    interface Rect {
      xMin: number;
      xMax: number;
      yMin: number;
      yMax: number;
    }

    const type: RecordIoType<Rect> = new RecordType<Rect>({
      properties: {
        xMin: {type: new IntegerType()},
        xMax: {type: new IntegerType(), changeCase: CaseStyle.ScreamingSnakeCase},
        yMin: {type: new IntegerType(), rename: "__yMin"},
        yMax: {type: new IntegerType()},
      },
      rename: {xMin: "xmin"},
      changeCase: CaseStyle.KebabCase,
    });

    const items: TestItem[] = [
      {
        name: "Rect {xMin: 0, xMax: 10, yMin: 20, yMax: 30}",
        value: {
          xMin: 0,
          xMax: 10,
          yMin: 20,
          yMax: 30,
        },
        io: [
          {
            writer: TOML_WRITER,
            reader: TOML_READER,
            raw: `xmin = 0
X_MAX = 10
__yMin = 20
y-max = 30`,
          },
        ],
      },
    ];

    registerMochaSuites(type, items);
  });
});
