import {CheckKind} from "./check-kind.mts";

export interface TrimmedCheck {
  readonly check: CheckKind.Trimmed,
  readonly children?: null;
}

export function formatTrimmedCheck(): string {
  return "string must be trimmed";
}
