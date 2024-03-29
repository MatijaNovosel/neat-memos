import { MemoModel } from "@/models/memo";

export interface IMemoService {
  getMemos(userId: string): Promise<MemoModel[]>;
}
