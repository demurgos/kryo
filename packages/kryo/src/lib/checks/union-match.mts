import type {CheckId} from "../index.mts";
import {CheckKind} from "./check-kind.mts";

export interface UnionMatchCheck {
  readonly check: CheckKind.UnionMatch,
  readonly children: [CheckId];
}

export function formatUnionMatchCheck(): string {
  return "at least one variant of the `TaggedUnion` must match";
}
