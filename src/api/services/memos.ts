import { PiniaStore } from "@/constants/types";
import { CreateMemoModel, MemoModel, UpdateMemoModel } from "@/models/memo";
import { useAppStore } from "@/store/app";
import { IMemoService } from "../interfaces/memos";

export class MemoService implements IMemoService {
  appStore: PiniaStore<typeof useAppStore>;

  constructor() {
    const appStore = useAppStore();
    this.appStore = appStore;
  }

  async getMemo(id: number): Promise<MemoModel | null> {
    const { data, error } = await this.appStore.supabase
      .from("memos")
      .select(
        "id, createdAt, content, userId, pinned, private, tags ( id, content, color), resources (*)"
      )
      .eq("id", id);

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return data.map<MemoModel>((memo) => ({
      ...memo,
      files: memo.resources
    }))[0];
  }

  async editMemo(data: UpdateMemoModel): Promise<void> {
    const { error } = await this.appStore.supabase
      .from("memos")
      .update([
        {
          content: data.content,
          updatedAt: new Date()
        }
      ])
      .eq("id", data.id);

    if (error) {
      throw error;
    }

    const idsToAdd = data.tagIds.filter((x) => !data.initialTagIds.includes(x));
    const idsToRemove = data.initialTagIds.filter((x) => !data.tagIds.includes(x));

    for (let i = 0; i < idsToRemove.length; i++) {
      const { error } = await this.appStore.supabase
        .from("memoTags")
        .delete()
        .eq("tagId", idsToRemove[i])
        .eq("memoId", data.id);
      if (error) {
        throw error;
      }
    }

    for (let i = 0; i < idsToAdd.length; i++) {
      const { error } = await this.appStore.supabase.from("memoTags").insert([
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
    const { error } = await this.appStore.supabase
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
    const { data: response, error } = await this.appStore.supabase
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
      const { error } = await this.appStore.supabase
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

  async deleteMemo(id: number, fileIds: string[]): Promise<void> {
    const { error } = await this.appStore.supabase.from("memos").delete().eq("id", id);
    if (error) {
      throw error;
    }

    if (fileIds.length) {
      const { error: fileDeleteError } = await this.appStore.supabase.storage
        .from("neatMemos")
        .remove(fileIds);

      if (fileDeleteError) {
        throw fileDeleteError;
      }
    }
  }

  async getMemos(userId: string): Promise<MemoModel[]> {
    const { data, error } = await this.appStore.supabase
      .from("memos")
      .select(
        "id, createdAt, content, userId, pinned, private, tags ( id, content, color), resources (*)"
      )
      .eq("userId", userId);

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map<MemoModel>((memo) => ({
      ...memo,
      files: memo.resources
    }));
  }
}
