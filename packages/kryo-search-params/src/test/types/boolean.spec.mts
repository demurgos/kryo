import {describe} from "node:test";

import { BooleanType } from "kryo/boolean";
import type {TestItem} from "kryo-testing";
import {registerErrMochaTests, registerMochaSuites} from "kryo-testing";

import {SEARCH_PARAMS_READER} from "../../lib/search-params-reader.mts";
import {SEARCH_PARAMS_WRITER} from "../../lib/search-params-writer.mts";

describe("kryo-search-params | Boolean", function () {
  const type: BooleanType = new BooleanType();

  const items: TestItem[] = [
    {name: "true", value: true, io: [{writer: SEARCH_PARAMS_WRITER, reader: SEARCH_PARAMS_READER, raw: "_=true"}]},
    {name: "false", value: false, io: [{writer: SEARCH_PARAMS_WRITER, reader: SEARCH_PARAMS_READER, raw: "_=false"}]},
  ];

  registerMochaSuites(type, items);

  describe("Reader", function () {
    const invalids: string[] = [
      "1",
      "\"on\"",
      "\"true\"",
    ];
    registerErrMochaTests(SEARCH_PARAMS_READER, type, invalids);
  });
});
