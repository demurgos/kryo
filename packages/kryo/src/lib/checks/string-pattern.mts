import {CheckKind} from "./check-kind.mts";

export interface StringPatternCheck {
  readonly check: CheckKind.StringPattern,
  readonly children?: null;
}

export function formatStringPatternCheck(): string {
  return "string must match pattern";
}
