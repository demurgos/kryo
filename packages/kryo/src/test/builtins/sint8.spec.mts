import {describe} from "node:test";

import { $Sint8 } from "../../lib/integer.mts";
import type { TypedValue } from "../helpers/test.mts";
import { runTests } from "../helpers/test.mts";

describe("$Sint8", function () {
  const items: TypedValue[] = [
    // Valid values
    {name: "0", value: 0, valid: true},
    {name: "-0", value: -0, valid: true},
    {name: "1", value: 1, valid: true},
    {name: "3", value: 3, valid: true},
    {name: "7", value: 7, valid: true},
    {name: "15", value: 15, valid: true},
    {name: "31", value: 31, valid: true},
    {name: "63", value: 63, valid: true},
    {name: "127", value: 127, valid: true},
    {name: "-128", value: -128, valid: true},
    // Invalid values
    {name: "-129", value: -129, valid: false},
    {name: "128", value: 128, valid: false},
  ];

  runTests($Sint8, items);
});
