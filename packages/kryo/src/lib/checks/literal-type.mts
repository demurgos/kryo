import type {CheckId} from "../index.mts";
import {CheckKind} from "./check-kind.mts";

export interface LiteralTypeCheck {
  readonly check: CheckKind.LiteralType,
  readonly children: [CheckId];
}

export function formatLiteralTypeCheck(): string {
  return "expected value to have literal type";
}
