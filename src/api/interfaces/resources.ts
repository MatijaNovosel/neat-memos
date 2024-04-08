import { ResourceUploadReturnDto } from "@/models/resources";

export interface IResourcesService {
  uploadFile(file: File, memoId: number): Promise<ResourceUploadReturnDto | null>;
  retrieveFile(id: string): Promise<string>;
  deleteFile(id: string): Promise<void>;
}
