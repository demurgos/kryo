import {describe} from "node:test";

import {Float64Type} from "kryo/float64";
import type {TestItem} from "kryo-testing";
import {registerErrMochaTests, registerMochaSuites} from "kryo-testing";

import {SEARCH_PARAMS_READER} from "../../lib/search-params-reader.mts";
import {SEARCH_PARAMS_WRITER} from "../../lib/search-params-writer.mts";

describe("kryo-search-params | Float64", function () {
  const $Float64: Float64Type = new Float64Type();

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
      name: "Number.MIN_SAFE_INTEGER",
      value: Number.MIN_SAFE_INTEGER,
      io: [
        {writer: SEARCH_PARAMS_WRITER, reader: SEARCH_PARAMS_READER, raw: "_=-9007199254740991"},
      ],
    },
    {
      name: "Number.MAX_VALUE",
      value: Number.MAX_VALUE,
      io: [
        {writer: SEARCH_PARAMS_WRITER, reader: SEARCH_PARAMS_READER, raw: "_=1.7976931348623157e%2B308"},
      ],
    },
    {
      name: "Number.MIN_VALUE",
      value: Number.MIN_VALUE,
      io: [
        {writer: SEARCH_PARAMS_WRITER, reader: SEARCH_PARAMS_READER, raw: "_=5e-324"},
      ],
    },
    {
      name: "0.5",
      value: 0.5,
      io: [
        {writer: SEARCH_PARAMS_WRITER, reader: SEARCH_PARAMS_READER, raw: "_=0.5"},
      ],
    },
    {
      name: "0.0001",
      value: 0.0001,
      io: [
        {writer: SEARCH_PARAMS_WRITER, reader: SEARCH_PARAMS_READER, raw: "_=0.0001"},
      ],
    },
    {
      name: "Number.EPSILON",
      value: Number.EPSILON,
      io: [
        {writer: SEARCH_PARAMS_WRITER, reader: SEARCH_PARAMS_READER, raw: "_=2.220446049250313e-16"},
      ],
    },
  ];

  registerMochaSuites($Float64, items);

  describe("Reader", function () {
    const invalids: string[] = [
      "null",
      "true",
      "false",
      "",
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
    registerErrMochaTests(SEARCH_PARAMS_READER, $Float64, invalids);
  });

  describe("NaN support", function () {
    const $Float64WithNan: Float64Type = new Float64Type({allowNaN: true});
    const items: TestItem[] = [
      {
        value: 0,
        io: [
          {writer: SEARCH_PARAMS_WRITER, reader: SEARCH_PARAMS_READER, raw: "_=0"},
        ],
      },
      {
        value: 1,
        io: [
          {writer: SEARCH_PARAMS_WRITER, reader: SEARCH_PARAMS_READER, raw: "_=1"},
        ],
      },
      {
        value: NaN,
        io: [
          {writer: SEARCH_PARAMS_WRITER, reader: SEARCH_PARAMS_READER, raw: "_=NaN"},
        ],
      },
    ];

    registerMochaSuites($Float64WithNan, items);

    describe("Reader", function () {
      const invalids: string[] = [
        "_=Infinity",
        "_=-Infinity",
      ];
      registerErrMochaTests(SEARCH_PARAMS_READER, $Float64WithNan, invalids);
    });
  });

  describe("Infinity support", function () {
    const $Float64WithInfinity: Float64Type = new Float64Type({allowInfinity: true});
    const items: TestItem[] = [
      {
        value: 0,
        io: [
          {writer: SEARCH_PARAMS_WRITER, reader: SEARCH_PARAMS_READER, raw: "_=0"},
        ],
      },
      {
        value: 1,
        io: [
          {writer: SEARCH_PARAMS_WRITER, reader: SEARCH_PARAMS_READER, raw: "_=1"},
        ],
      },
      {
        value: Infinity,
        io: [
          {writer: SEARCH_PARAMS_WRITER, reader: SEARCH_PARAMS_READER, raw: "_=%2BInfinity"},
          {reader: SEARCH_PARAMS_READER, raw: "_=Infinity"},
        ],
      },
      {
        value: -Infinity,
        io: [
          {writer: SEARCH_PARAMS_WRITER, reader: SEARCH_PARAMS_READER, raw: "_=-Infinity"},
        ],
      },
    ];

    registerMochaSuites($Float64WithInfinity, items);

    describe("Reader", function () {
      const invalids: string[] = [
        "_=NaN",
      ];
      registerErrMochaTests(SEARCH_PARAMS_READER, $Float64WithInfinity, invalids);
    });
  });
});
