import { TagModel, CreateTagModel, UpdateTagModel } from "@/models/tag";
import { ITagService } from "../interfaces/tag";
import { SupabaseClient } from "@supabase/supabase-js";
import { useSupabase } from "@/composables/useSupabase";

export class TagService implements ITagService {
  supabase: SupabaseClient;

  constructor() {
    const { supabase } = useSupabase();
    this.supabase = supabase;
  }

  async getTags(userId: string): Promise<TagModel[]> {
    const { data, error } = await this.supabase
      .from("tags")
      .select("id, content, color")
      .order("createdAt", {
        ascending: false
      });

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map<TagModel>((tag) => ({ ...tag }));
  }

  async saveTag(data: CreateTagModel): Promise<number> {
    const { data: response, error } = await this.supabase
      .from("tags")
      .insert([
        {
          content: data.content,
          userId: data.userId,
          color: data.color
        }
      ])
      .select();

    if (error) {
      throw error;
    }

    const id = response![0].id;
    return id;
  }

  async editTag(data: UpdateTagModel): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async deleteTag(id: number): Promise<void> {
    const { error } = await this.supabase.from("tags").delete().eq("id", id);
    if (error) {
      throw error;
    }
  }
}
