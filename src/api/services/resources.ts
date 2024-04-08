import { PiniaStore } from "@/constants/types";
import { getExtensionFromFileName } from "@/helpers/file";
import { generateRandomString } from "@/helpers/misc";
import { ResourceUploadReturnDto } from "@/models/resources";
import { useAppStore } from "@/store/app";
import { IResourcesService } from "../interfaces/resources";

export class ResourcesService implements IResourcesService {
  appStore: PiniaStore<typeof useAppStore>;

  constructor() {
    const appStore = useAppStore();
    this.appStore = appStore;
  }

  async deleteFile(id: string): Promise<void> {
    const { error: fileDeleteError } = await this.appStore.supabase.storage
      .from("neatMemos")
      .remove([id]);

    if (fileDeleteError) {
      throw fileDeleteError;
    }
  }

  async retrieveFile(id: string): Promise<string> {
    const { data: filePath, error } = await this.appStore.supabase.storage
      .from("neatMemos")
      .createSignedUrl(id, 3.156e8); // 10 years

    if (error) {
      throw error;
    }

    return filePath?.signedUrl;
  }

  async uploadFile(file: File, memoId: number): Promise<ResourceUploadReturnDto | null> {
    const id = generateRandomString(6);
    const { data, error } = await this.appStore.supabase.storage
      .from("neatMemos")
      .upload(id, file, {
        cacheControl: "3600",
        upsert: false
      });

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    const url = await this.retrieveFile(id);

    const { error: fileSaveError } = await this.appStore.supabase.from("resources").insert([
      {
        id,
        name: `${id}.${getExtensionFromFileName(file.name)}`,
        size: file.size,
        url,
        memoId
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
