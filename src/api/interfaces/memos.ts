import { CreateMemoModel, MemoModel } from "@/models/memo";

export interface IMemoService {
  getMemos(userId: string): Promise<MemoModel[]>;
  saveMemo(data: CreateMemoModel): Promise<number>;
  deleteMemo(id: string): Promise<void>;
}
