import { useSupabase } from "@/composables/useSupabase";
import { CreateMemoModel, MemoModel } from "@/models/memo";
import { IMemoService } from "../interfaces/memos";
import { SupabaseClient } from "@supabase/supabase-js";

export class MemoService implements IMemoService {
  supabase: SupabaseClient;

  constructor() {
    const { supabase } = useSupabase();
    this.supabase = supabase;
  }

  async saveMemo(data: CreateMemoModel): Promise<number> {
    const { data: response, error } = await this.supabase
      .from("memos")
      .insert([
        {
          content: data.content,
          userId: "3ff413cc-c9c2-4723-8d8b-7cb7e0295463"
        }
      ])
      .select();
    const id = response![0].id;
    return id;
  }

  async deleteMemo(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async getMemos(userId: string): Promise<MemoModel[]> {
    const { data, error } = await this.supabase
      .from("memos")
      .select("id, createdAt, content, userId, pinned")
      .order("createdAt", {
        ascending: false
      });

    if (!data) {
      return [];
    }

    return data.map<MemoModel>((memo) => ({ ...memo }));
  }
}
