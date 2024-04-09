import { MemoFile } from "@/models/memo";
import { ResourceUploadReturnDto } from "@/models/resources";

export interface IResourcesService {
  uploadFile(file: File, memoId: number, userId: string): Promise<ResourceUploadReturnDto | null>;
  getFile(id: string): Promise<string>;
  deleteFile(id: string): Promise<void>;
  getFiles(userId: string): Promise<MemoFile[]>;
}
