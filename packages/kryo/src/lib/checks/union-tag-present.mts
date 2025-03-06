import {CheckKind} from "./check-kind.mts";

export interface UnionTagPresentCheck {
  readonly check: CheckKind.UnionTagPresent,
  readonly tag: string,
  readonly children?: null;
}

export function formatUnionTagPresentCheck(check: UnionTagPresentCheck): string {
  return `record tag ${check.tag} must be present`;
}
