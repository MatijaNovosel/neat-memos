import { PiniaStore } from "@/constants/types";
import { CreateTagModel, TagModel, UpdateTagModel } from "@/models/tag";
import { useAppStore } from "@/store/app";
import { ITagService } from "../interfaces/tag";

export class TagService implements ITagService {
  appStore: PiniaStore<typeof useAppStore>;

  constructor() {
    const appStore = useAppStore();
    this.appStore = appStore;
  }

  async getTags(userId: string): Promise<TagModel[]> {
    const { data, error } = await this.appStore.supabase
      .from("tags")
      .select("id, content, color")
      .eq("userId", userId);

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map<TagModel>((tag) => ({ ...tag }));
  }

  async saveTag(data: CreateTagModel): Promise<number> {
    const { data: response, error } = await this.appStore.supabase
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
    const { error } = await this.appStore.supabase.from("tags").delete().eq("id", id);
    if (error) {
      throw error;
    }
  }
}
