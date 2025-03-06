import {ArrayType} from "../../../lib/array.mts";
import {CaseStyle} from "../../../lib/index.mts";
import {LiteralType} from "../../../lib/literal.mts";
import {RecordType} from "../../../lib/record.mts";
import type {FsNode} from "./fs-node.mts";
import {$FsNode} from "./fs-node.mts";
import type {FsNodeBase} from "./fs-node-base.mts";
import {$FsNodeBase} from "./fs-node-base.mts";
import {$FsNodeType, FsNodeType} from "./fs-node-type.mts";

export interface Directory extends FsNodeBase {
  tag: FsNodeType.Directory;
  children: FsNode[];
}

export const $Directory: RecordType<Directory> = new RecordType<Directory>(() => ({
  properties: {
    ...$FsNodeBase.properties,
    tag: {type: new LiteralType<FsNodeType.Directory>({type: $FsNodeType, value: FsNodeType.Directory})},
    children: {type: new ArrayType({itemType: $FsNode, maxLength: Infinity}), optional: true},
  },
  changeCase: CaseStyle.SnakeCase,
}));
