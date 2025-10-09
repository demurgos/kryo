import type {AggregateCheck} from "./checks/aggregate.mts";
import {CheckKind} from "./checks/check-kind.mts";
import {
  type CheckId,
  type IoType,
  type KryoContext,
  type Reader,
  type ReadVisitor,
  type Result,
  writeError,
  type Writer
} from "./index.mts";

export type Diff = unknown;

/**
 * Type representing an opaque value.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class AnyType<T = any> implements IoType<T> {
  read<R>(cx: KryoContext, reader: Reader<R>, raw: R): Result<T, CheckId> {
    return reader.readAny(cx, raw, {
      fromBoolean(input: boolean): Result<boolean, never> {
        return {ok: true, value: input};
      },

      fromBytes(input: Uint8Array): Result<Uint8Array, never> {
        return {ok: true, value: input};
      },

      fromDate(input: Date): Result<Date, never> {
        return {ok: true, value: input};
      },

      fromFloat64(input: number): Result<number, never> {
        return {ok: true, value: input};
      },

      fromList: <RI, >(input: Iterable<RI>, itemReader: Reader<RI>): Result<unknown[], CheckId> => {
        let failedChecks: undefined | Set<CheckId> = undefined;
        const result: T[] = [];
        let i: number = 0;
        for (const rawItem of input) {
          const {ok, value: item} = cx.enter(i, () => this.read(cx, itemReader, rawItem));
          if (ok) {
            if (failedChecks === undefined) {
              // Happy path: push to the result
              // (otherwise skip, we'll return an error anyway)
              result.push(item);
            }
          } else {
            if (failedChecks === undefined) {
              failedChecks = new Set();
            }
            failedChecks.add(item);
          }
          i++;
        }
        if (failedChecks !== undefined) {
          return writeError(cx, {check: CheckKind.Aggregate, children: [...failedChecks]} satisfies AggregateCheck);
        }
        return {ok: true, value: result};
      },

      fromMap: <RK, RV>(input: Map<RK, RV>, keyReader: Reader<RK>, valueReader: Reader<RV>): Result<Record<keyof unknown, unknown>, never> => {
        const result: Record<keyof unknown, unknown> = Object.create(null);
        let errors: CheckId[] | undefined = undefined;
        for (const [rawKey, rawValue] of input) {
          const {ok: okKey, value: key} = this.read(cx, keyReader, rawKey);
          if (!okKey) {
            errors ??= [];
            errors.push(key);
            continue;
          }
          const {ok, value} = this.read(cx, valueReader, rawValue);
          if (!ok) {
            errors ??= [];
            errors.push(value);
            continue;
          }
          Reflect.set(result, key as keyof unknown, value);
        }
        return {ok: true, value: result};
      },

      fromNull(): Result<null, never> {
        return {ok: true, value: null};
      },

      fromString(input: string): Result<string, never> {
        return {ok: true, value: input};
      }
    } as ReadVisitor<unknown>) as Result<T, CheckId>;
  }

  write<W>(writer: Writer<W>, value: T): W {
    return writer.writeAny(value);
  }

  test(_cx: KryoContext, value: unknown): Result<T, never> {
    return {ok: true, value: value as unknown as T};
  }

  equals(val1: T, val2: T): boolean {
    return val1 === val2;
  }

  clone(value: T): T {
    return value;
  }
}

export const $Any: AnyType = new AnyType();
