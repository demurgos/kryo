import {describe} from "node:test";

import { $Date } from "../../lib/date.mts";
import type { GenericIoType } from "../../lib/generic.mts";
import { GenericType } from "../../lib/generic.mts";
import type { IoType } from "../../lib/index.mts";
import { $Uint32 } from "../../lib/integer.mts";
import type { RecordIoType } from "../../lib/record.mts";
import { RecordType } from "../../lib/record.mts";
import { $Ucs2String } from "../../lib/ucs2-string.mts";
import type { TypedValue } from "../helpers/test.mts";
import { runTests } from "../helpers/test.mts";

describe("kryo | Generic", function () {
  describe("TimedValue<T>", function () {
    interface TimedValue<T> {
      time: Date;
      value: T;
    }

    const $TimedValue: GenericIoType<(<T>(t: T) => TimedValue<T>)> = new GenericType({
      apply<T>(t: IoType<T>): RecordIoType<TimedValue<T>> {
        return new RecordType({
          properties: {
            time: {type: $Date},
            value: {type: t},
          },
        });
      }
    });

    describe("TimedValue<string>", function () {
      const $TimedString = $TimedValue.apply($Ucs2String) as IoType<TimedValue<string>>;
      const items: TypedValue[] = [
        {
          value: {
            time: new Date(0),
            value: "foo",
          },
          valid: true,
        },
        {
          value: {
            time: new Date(0),
            value: 42,
          },
          valid: false,
        },
      ];

      runTests($TimedString, items);
    });

    describe("TimedValue<number>", function () {
      const $TimedUint32 = $TimedValue.apply($Uint32) as IoType<TimedValue<number>>;
      const items: TypedValue[] = [
        {
          value: {
            time: new Date(0),
            value: 42,
          },
          valid: true,
        },
        {
          value: {
            time: new Date(0),
            value: "foo",
          },
          valid: false,
        },
      ];

      runTests($TimedUint32, items);
    });
  });
});
