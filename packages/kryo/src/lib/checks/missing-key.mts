import type {AnyKey} from "../index.mts";
import {CheckKind} from "./check-kind.mts";

export interface MissingKeyCheck {
  readonly check: CheckKind.MissingKey;
  readonly key: AnyKey;
  readonly children?: null;
}

export function formatMissingKeyCheck(check: MissingKeyCheck): string {
  const key = check.key;
  let debugKey: string;
  if (typeof key === "string") {
    debugKey = JSON.stringify(key);
  } else if (typeof key === "number") {
    debugKey = String(key);
  } else {
    debugKey = `Symbol(${String(key)})`;
  }
  return `record missing required entry for key ${debugKey}`;
}
