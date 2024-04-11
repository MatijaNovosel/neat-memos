import { CreateMemoModel, MemoFile, MemoModel, UpdateMemoModel } from "@/models/memo";

export interface IMemoService {
  getMemos(userId: string): Promise<MemoModel[]>;
  getMemo(id: number): Promise<MemoModel | null>;
  saveMemo(data: CreateMemoModel): Promise<number>;
  editMemo(data: UpdateMemoModel): Promise<MemoFile[]>;
  deleteMemo(id: number, fileIds: string[]): Promise<void>;
  pinMemo(id: number, pinStatus: boolean): Promise<void>;
}
