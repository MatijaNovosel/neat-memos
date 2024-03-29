import { CreateMemoModel, MemoModel, UpdateMemoModel } from "@/models/memo";

export interface IMemoService {
  getMemos(userId: string): Promise<MemoModel[]>;
  saveMemo(data: CreateMemoModel): Promise<number>;
  editMemo(data: UpdateMemoModel): Promise<void>;
  deleteMemo(id: number): Promise<void>;
  pinMemo(id: number, pinStatus: boolean): Promise<void>;
}
