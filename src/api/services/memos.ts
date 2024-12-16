import supabase from "@/helpers/supabase";
import { CreateMemoModel, MemoModel, UpdateMemoModel } from "@/models/memo";
import { ResourceFile } from "@/models/resources";
import { IMemoService } from "../interfaces/memos";
import { IResourcesService } from "../interfaces/resources";
import { ResourcesService } from "./resources";

export class MemoService implements IMemoService {
  resourcesService: IResourcesService;

  constructor() {
    this.resourcesService = new ResourcesService();
  }

  async archiveMemo(id: number): Promise<void> {
    const { error } = await supabase
      .from("memos")
      .update([
        {
          archived: true
        }
      ])
      .eq("id", id);

    if (error) throw error;
  }

  async getMemo(id: number): Promise<MemoModel | null> {
    const { data, error } = await supabase
      .from("memos")
      .select(
        `
        id,
        createdAt,
        archived,
        content,
        updatedAt,
        userId,
        pinned,
        private,
        tags ( id, content, color),
        resources (*)
      `
      )
      .eq("id", id);

    if (error) throw error;
    if (!data) return null;

    return data.map<MemoModel>((memo) => ({
      ...memo,
      files: memo.resources
    }))[0];
  }

  async editMemo(data: UpdateMemoModel): Promise<ResourceFile[]> {
    const { error } = await supabase
      .from("memos")
      .update([
        {
          content: data.content,
          updatedAt: new Date()
        }
      ])
      .eq("id", data.id);

    if (error) throw error;

    // Tag updating

    const idsToAdd = data.tagIds.filter((x) => !data.initialTagIds.includes(x));
    const idsToRemove = data.initialTagIds.filter((x) => !data.tagIds.includes(x));

    for (let i = 0; i < idsToRemove.length; i++) {
      const { error } = await supabase
        .from("memoTags")
        .delete()
        .eq("tagId", idsToRemove[i])
        .eq("memoId", data.id);
      if (error) throw error;
    }

    for (let i = 0; i < idsToAdd.length; i++) {
      const { error } = await supabase.from("memoTags").insert([
        {
          tagId: idsToAdd[i],
          memoId: data.id
        }
      ]);
      if (error) throw error;
    }

    // File updating
    const newFiles: ResourceFile[] = [];
    const filesToAdd = data.files.filter((f) => !("id" in f)) as File[];
    const oldFiles = data.files.filter((f) => "id" in f) as ResourceFile[];

    const filesToRemove = data.initialFiles.filter(
      (x) => !oldFiles.map((x) => x.id).includes(x.id)
    );

    for (const file of filesToAdd) {
      const response = await this.resourcesService.uploadFile(file, data.id, data.userId);
      newFiles.push({
        createdAt: new Date().toISOString(),
        size: file.size,
        id: response?.id as string,
        memoId: data.id,
        name: file.name,
        url: response?.url as string,
        cardId: null
      });
    }

    for (const file of filesToRemove) {
      await this.resourcesService.deleteFile(file.id);
    }

    return [...newFiles, ...oldFiles];
  }

  async pinMemo(id: number, pinStatus: boolean): Promise<void> {
    const { error } = await supabase
      .from("memos")
      .update([
        {
          pinned: !pinStatus
        }
      ])
      .eq("id", id);

    if (error) throw error;
  }

  async saveMemo(data: CreateMemoModel): Promise<number> {
    const { data: response, error } = await supabase
      .from("memos")
      .insert([
        {
          content: data.content,
          userId: data.userId
        }
      ])
      .select();

    const id = response![0].id;

    if (error) throw error;

    for (let i = 0; i < data.tagIds.length; i++) {
      const { error } = await supabase
        .from("memoTags")
        .insert([
          {
            tagId: data.tagIds[i],
            memoId: id
          }
        ])
        .select();
      if (error) throw error;
    }

    return id;
  }

  async deleteMemo(id: number, fileIds: string[]): Promise<void> {
    const { error } = await supabase.from("memos").delete().eq("id", id);
    if (error) throw error;
    if (fileIds.length) {
      const { error: fileDeleteError } = await supabase.storage.from("neatMemos").remove(fileIds);
      if (fileDeleteError) throw fileDeleteError;
    }
  }

  async getMemos(userId: string): Promise<MemoModel[]> {
    const { data, error } = await supabase
      .from("memos")
      .select(
        "id, archived, createdAt, content, updatedAt, userId, pinned, private, tags ( id, content, color), resources (*)"
      )
      .eq("userId", userId);

    if (error) throw error;
    if (!data) return [];

    return data.map<MemoModel>((memo) => ({
      content: memo.content,
      id: memo.id,
      createdAt: memo.createdAt,
      pinned: memo.pinned,
      private: memo.private,
      userId: memo.userId,
      updatedAt: memo.updatedAt,
      files: memo.resources,
      tags: memo.tags,
      archived: memo.archived
    }));
  }
}
