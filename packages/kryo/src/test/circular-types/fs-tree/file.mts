import { CaseStyle } from "../../../lib/index.mts";
import { IntegerType } from "../../../lib/integer.mts";
import { LiteralType } from "../../../lib/literal.mts";
import { RecordType } from "../../../lib/record.mts";
import type { FsNodeBase } from "./fs-node-base.mts";
import { $FsNodeBase } from "./fs-node-base.mts";
import { $FsNodeType, FsNodeType } from "./fs-node-type.mts";

export interface File extends FsNodeBase {
  tag: FsNodeType.File;
  size: number;
}

export const $File: RecordType<File> = new RecordType<File>(() => ({
  properties: {
    ...$FsNodeBase.properties,
    tag: {type: new LiteralType<FsNodeType.File>({type: $FsNodeType, value: FsNodeType.File})},
    size: {type: new IntegerType()},
  },
  changeCase: CaseStyle.SnakeCase,
}));
