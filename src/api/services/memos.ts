import { MemoModel } from "@/models/memo";
import { IMemoService } from "../interfaces/memos";

export class MemoService implements IMemoService {
  async getMemos(userId: string): Promise<MemoModel[]> {
    return [];
  }
}
