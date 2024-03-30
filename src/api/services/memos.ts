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
      .eq("id", data.id);

    if (error) {
      throw error;
    }

    const idsToAdd = data.tagIds.filter((x) => !data.initialTagIds.includes(x));
    const idsToRemove = data.initialTagIds.filter((x) => !data.tagIds.includes(x));

    for (let i = 0; i < idsToRemove.length; i++) {
      const { error } = await this.supabase
        .from("memoTags")
        .delete()
        .eq("tagId", idsToRemove[i])
        .eq("memoId", data.id);
      if (error) {
        throw error;
      }
    }

    for (let i = 0; i < idsToAdd.length; i++) {
      const { error } = await this.supabase.from("memoTags").insert([
        {
          tagId: idsToAdd[i],
          memoId: data.id
        }
      ]);
      if (error) {
        throw error;
      }
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
      .eq("id", id);

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

    const id = response![0].id;

    if (error) {
      throw error;
    }

    for (let i = 0; i < data.tagIds.length; i++) {
      const { error } = await this.supabase
        .from("memoTags")
        .insert([
          {
            tagId: data.tagIds[i],
            memoId: id
          }
        ])
        .select();
      if (error) {
        throw error;
      }
    }

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
