import type {CheckId} from "../index.mts";
import {CheckKind} from "./check-kind.mts";

export interface AggregateCheck {
  readonly check: CheckKind.Aggregate,
  readonly children: readonly CheckId[],
}

export function formatAggregateCheck(check: AggregateCheck): string {
  return `check has ${check.children.length} child checks`;
}
