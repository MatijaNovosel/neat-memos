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

  getTags(userId: string): Promise<TagModel[]> {
    throw new Error("Method not implemented.");
  }

  saveTag(data: CreateTagModel): Promise<number> {
    throw new Error("Method not implemented.");
  }

  editTag(data: UpdateTagModel): Promise<void> {
    throw new Error("Method not implemented.");
  }

  deleteTag(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
