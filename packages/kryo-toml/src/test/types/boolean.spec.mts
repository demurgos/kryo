import {describe} from "node:test";

import {$Boolean} from "kryo/boolean";
import type {TestItem} from "kryo-testing";
import {registerErrMochaTests, registerMochaSuites} from "kryo-testing";

import {TOML_READER} from "../../lib/toml-reader.mts";
import {TOML_WRITER} from "../../lib/toml-writer.mts";

describe("kryo-toml | Boolean", function () {
  describe("Default", function () {
    const items: TestItem[] = [
      {name: "true", value: true, io: [{writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = true"}]},
      {name: "false", value: false, io: [{writer: TOML_WRITER, reader: TOML_READER, raw: "\"\" = false"}]},
    ];

    registerMochaSuites($Boolean, items);

    describe("Reader", function () {
      const invalids: string[] = [
        "1",
        "\"on\"",
        "\"true\"",
      ];
      registerErrMochaTests(TOML_READER, $Boolean, invalids);
    });
  });
});
