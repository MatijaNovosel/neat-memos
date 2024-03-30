import { useSupabase } from "@/composables/useSupabase";
import { CreateMemoModel, MemoModel, UpdateMemoModel } from "@/models/memo";
import { IMemoService } from "../interfaces/memos";
import { SupabaseClient } from "@supabase/supabase-js";

export class MemoService implements IMemoService {
  supabase: SupabaseClient;

  constructor() {
    const { supabase } = useSupabase();
    this.supabase = supabase;
  }

  async editMemo(data: UpdateMemoModel): Promise<void> {
    const { error } = await this.supabase
      .from("memos")
      .update([
        {
          content: data.content
        }
      ])
      .eq("id", data.id)
      .select();

    if (error) {
      throw error;
    }
  }

  async pinMemo(id: number, pinStatus: boolean): Promise<void> {
    const { error } = await this.supabase
      .from("memos")
      .update([
        {
          pinned: !pinStatus
        }
      ])
      .eq("id", id)
      .select();

    if (error) {
      throw error;
    }
  }

  async saveMemo(data: CreateMemoModel): Promise<number> {
    const { data: response, error } = await this.supabase
      .from("memos")
      .insert([
        {
          content: data.content,
          userId: data.userId
        }
      ])
      .select();

    if (error) {
      throw error;
    }

    const id = response![0].id;
    return id;
  }

  async deleteMemo(id: number): Promise<void> {
    const { error } = await this.supabase.from("memos").delete().eq("id", id);
    if (error) {
      throw error;
    }
  }

  async getMemos(userId: string): Promise<MemoModel[]> {
    const { data, error } = await this.supabase
      .from("memos")
      .select("id, createdAt, content, userId, pinned, tags ( id, content, color)")
      .order("createdAt", {
        ascending: false
      });

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map<MemoModel>((memo) => ({
      ...memo
    }));
  }
}
