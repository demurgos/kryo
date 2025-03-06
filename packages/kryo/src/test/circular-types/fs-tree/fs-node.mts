import { TaggedUnionType } from "../../../lib/tagged-union.mts";
import type { Directory } from "./directory.mts";
import { $Directory } from "./directory.mts";
import type { File } from "./file.mts";
import { $File } from "./file.mts";

export type FsNode =
  Directory
  | File;

export const $FsNode: TaggedUnionType<FsNode> = new TaggedUnionType<FsNode>(() => ({
  variants: [
    $Directory,
    $File,
  ],
  tag: "tag",
}));
