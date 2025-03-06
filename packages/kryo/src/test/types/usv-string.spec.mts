import * as assert from "node:assert/strict";
import {describe, test} from "node:test";

import {NOOP_CONTEXT} from "../../lib/index.mts";
import { UsvStringType } from "../../lib/usv-string.mts";
import type { TypedValue } from "../helpers/test.mts";
import { runTests } from "../helpers/test.mts";

describe("UsvStringType", function () {
  describe("basic support", function () {
    const type: UsvStringType = new UsvStringType({maxCodepoints: 500});

    const items: TypedValue[] = [
      // Valid items
      {name: "\"\"", value: "", valid: true},
      {name: "\"Hello World!\"", value: "Hello World!", valid: true},
      {name: "Drop the bass", value: "ԂЯØǷ Łƕ੬ ɃɅϨϞ", valid: true},
      // Invalid items
      /* tslint:disable-next-line:no-construct */
      {name: "new String(\"stringObject\")", value: new String("stringObject"), valid: false},
      {name: "0.5", value: 0.5, valid: false},
      {name: "0.0001", value: 0.0001, valid: false},
      {name: "Infinity", value: Infinity, valid: false},
      {name: "-Infinity", value: -Infinity, valid: false},
      {name: "NaN", value: NaN, valid: false},
      {name: "undefined", value: undefined, valid: false},
      {name: "null", value: null, valid: false},
      {name: "true", value: true, valid: false},
      {name: "false", value: false, valid: false},
      {name: "[]", value: [], valid: false},
      {name: "{}", value: {}, valid: false},
      {name: "new Date()", value: new Date(), valid: false},
      {name: "/regex/", value: /regex/, valid: false},
    ];

    runTests(type, items);
  });

  describe("Ensure valid codepoints with Javascript (UCS2) strings", function () {
    test("should accept the empty string, when requiring length exactly 0", function () {
      assert.strictEqual(new UsvStringType({minCodepoints: 0, maxCodepoints: 0}).test(NOOP_CONTEXT, "").ok, true);
    });
    test("should accept the string \"a\" (ASCII codepoint), when requiring length exactly 1", function () {
      assert.strictEqual(new UsvStringType({minCodepoints: 1, maxCodepoints: 1}).test(NOOP_CONTEXT, "a").ok, true);
    });
    test("should accept the string \"∑\" (BMP codepoint), when requiring length exactly 1", function () {
      assert.strictEqual(new UsvStringType({minCodepoints: 1, maxCodepoints: 1}).test(NOOP_CONTEXT, "∑").ok, true);
    });
    test("should reject the string \"𝄞\" (non-BMP codepoint), when requiring length exactly 2", function () {
      assert.strictEqual(new UsvStringType({minCodepoints: 2, maxCodepoints: 2}).test(NOOP_CONTEXT, "𝄞").ok, false);
    });
    test("should accept the string \"𝄞\" (non-BMP codepoint), when requiring length exactly 1", function () {
      assert.strictEqual(new UsvStringType({minCodepoints: 1, maxCodepoints: 1}).test(NOOP_CONTEXT, "𝄞").ok, true);
    });
    describe("should reject unmatched surrogate halves", function () {
      // 𝄞 corresponds to the surrogate pair (0xd834, 0xdd1e)
      const type: UsvStringType = new UsvStringType({maxCodepoints: 500});
      const items: string[] = ["\ud834", "a\ud834", "\ud834b", "a\ud834b", "\udd1e", "a\udd1e", "\udd1eb", "a\udd1eb"];
      for (const item of items) {
        test(JSON.stringify(item), function () {
          assert.strictEqual(type.test(NOOP_CONTEXT, item).ok, false);
        });
      }
    });
    test("should reject reversed (invalid) surrogate pairs", function () {
      assert.strictEqual(new UsvStringType({maxCodepoints: 500}).test(NOOP_CONTEXT, "\udd1e\ud834").ok, false);
    });
  });
});
