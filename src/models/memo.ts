import { TagModel } from "./tag";

export interface MemoModel {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  content: string;
  pinned: boolean;
  private: boolean;
  archived: boolean;
  tags?: TagModel[];
  files?: File[] | MemoFile[];
}

export interface UpdateMemoModel {
  id: number;
  userId: string;
  content: string;
  tagIds: number[];
  initialTagIds: number[];
  initialFiles: MemoFile[];
  files: Array<MemoFile | File>;
}

export interface CreateMemoModel {
  content: string;
  userId: string;
  tagIds: number[];
}

export interface MemoFile {
  id: string;
  name: string;
  size: number;
  url: string;
  createdAt: string;
  memoId: number;
}
