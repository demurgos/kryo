import {TsEnumType} from "../../../lib/ts-enum.mts";

const File: unique symbol = Symbol("File");
const Directory: unique symbol = Symbol("Directory");

const FsNodeType = {
  File,
  Directory,
} as const;

type FsNodeType = typeof FsNodeType[keyof typeof FsNodeType];

declare namespace FsNodeType {
  type File = typeof FsNodeType.File;
  type Directory = typeof FsNodeType.Directory;
}

export {FsNodeType};

export const $FsNodeType: TsEnumType<FsNodeType> = new TsEnumType<FsNodeType>({
  enum: FsNodeType,
  rename: {
    File: "Node/File",
    Directory: "Node/Directory",
  },
});
