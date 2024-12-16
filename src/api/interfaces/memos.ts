import { CreateMemoModel, MemoModel, UpdateMemoModel } from "@/models/memo";
import { ResourceFile } from "@/models/resources";

export interface IMemoService {
  getMemos(userId: string): Promise<MemoModel[]>;
  getMemo(id: number): Promise<MemoModel | null>;
  saveMemo(data: CreateMemoModel): Promise<number>;
  editMemo(data: UpdateMemoModel): Promise<ResourceFile[]>;
  deleteMemo(id: number, fileIds: string[]): Promise<void>;
  pinMemo(id: number, pinStatus: boolean): Promise<void>;
  archiveMemo(id: number): Promise<void>;
}
