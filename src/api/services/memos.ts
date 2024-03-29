import { useSupabase } from "@/composables/useSupabase";
import { MemoModel } from "@/models/memo";
import { IMemoService } from "../interfaces/memos";

export class MemoService implements IMemoService {
  async getMemos(userId: string): Promise<MemoModel[]> {
    const { supabase } = useSupabase();
    const { data, error } = await supabase
      .from("memos")
      .select("id, createdAt, content")
      .order("createdAt", {
        ascending: false
      });
    console.log(data);
    return [];
  }
}
