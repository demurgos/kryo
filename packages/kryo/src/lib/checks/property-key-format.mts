import type {CheckId} from "../index.mts";
import {CheckKind} from "./check-kind.mts";

export interface PropertyKeyFormatCheck {
  readonly check: CheckKind.PropertyKeyFormat,
  readonly children?: readonly CheckId[];
}

export function formatPropertyKeyFormatCheck(): string {
  return "record property key must be valid";
}
