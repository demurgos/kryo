import type {CheckId} from "../index.mts";
import {CheckKind} from "./check-kind.mts";

export interface PropertyValueCheck {
  readonly check: CheckKind.PropertyValue,
  readonly children: [CheckId];
}

export function formatPropertyValueCheck(): string {
  return "record property value must be valid";
}
