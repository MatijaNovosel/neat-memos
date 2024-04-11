import { generateRandomString } from "@/helpers/misc";
import supabase from "@/helpers/supabase";
import { MemoFile } from "@/models/memo";
import { ResourceUploadReturnDto } from "@/models/resources";
import { IResourcesService } from "../interfaces/resources";

export class ResourcesService implements IResourcesService {
  async getFiles(userId: string): Promise<MemoFile[]> {
    const { data, error } = await supabase.from("resources").select("*").eq("userId", userId);

    if (error) {
      throw error;
    }

    return data;
  }

  async deleteFile(id: string): Promise<void> {
    const { error: fileDeleteError } = await supabase.storage.from("neatMemos").remove([id]);

    if (fileDeleteError) {
      throw fileDeleteError;
    }

    const { error } = await supabase.from("resources").delete().eq("id", id);

    if (error) {
      throw error;
    }
  }

  async getFile(id: string): Promise<string> {
    const { data: filePath, error } = await supabase.storage
      .from("neatMemos")
      .createSignedUrl(id, 3.156e8); // 10 years

    if (error) {
      throw error;
    }

    return filePath?.signedUrl;
  }

  async uploadFile(
    file: File,
    memoId: number,
    userId: string
  ): Promise<ResourceUploadReturnDto | null> {
    const id = generateRandomString(6);
    const { data, error } = await supabase.storage.from("neatMemos").upload(id, file, {
      cacheControl: "3600",
      upsert: false
    });

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    const url = await this.getFile(id);

    const { error: fileSaveError } = await supabase.from("resources").insert([
      {
        id,
        name: file.name,
        size: file.size,
        url,
        memoId,
        userId
      }
    ]);

    if (fileSaveError) {
      throw fileSaveError;
    }

    return {
      url,
      id
    };
  }
}
