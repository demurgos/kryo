import { CaseStyle } from "../../../lib/index.mts";
import { RecordType } from "../../../lib/record.mts";
import { Ucs2StringType } from "../../../lib/ucs2-string.mts";
import { $FsNodeType, FsNodeType } from "./fs-node-type.mts";

export interface FsNodeBase {
  tag: FsNodeType;
  name: string;
}

export const $FsNodeBase: RecordType<FsNodeBase> = new RecordType<FsNodeBase>({
  properties: {
    tag: {type: $FsNodeType},
    name: {type: new Ucs2StringType({maxLength: Infinity})},
  },
  changeCase: CaseStyle.SnakeCase,
});
