import {CheckKind} from "./check-kind.mts";

export interface LowerCaseCheck {
  readonly check: CheckKind.LowerCase,
  readonly children?: null;
}

export function formatLowerCaseCheck(): string {
  return "string must be lowerCase";
}
