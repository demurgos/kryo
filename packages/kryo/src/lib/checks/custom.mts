import type {CheckId} from "../index.mts";
import {CheckKind} from "./check-kind.mts";

export interface CustomCheck {
  readonly check: CheckKind.Custom,
  readonly message: string,
  readonly children?: null | CheckId[];
}

export function formatCustomCheck(check: CustomCheck): string {
  return check.message;
}
