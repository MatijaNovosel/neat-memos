import { PiniaStore } from "@/constants/types";
import { useAppStore } from "@/store/app";
import { IResourcesService } from "../interfaces/resources";

export class ResourcesService implements IResourcesService {
  appStore: PiniaStore<typeof useAppStore>;

  constructor() {
    const appStore = useAppStore();
    this.appStore = appStore;
  }

  async uploadFile(file: File): Promise<string> {
    const { data, error } = await this.appStore.supabase.storage
      .from("neatMemos")
      .upload(file.name, file, {
        cacheControl: "3600",
        upsert: false
      });

    if (error) {
      throw error;
    }

    if (!data) {
      return "";
    }

    const { data: filePath } = this.appStore.supabase.storage
      .from("neatMemos")
      .getPublicUrl(file.name);

    return filePath.publicUrl;
  }
}
