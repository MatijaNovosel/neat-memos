export interface IResourcesService {
  uploadFile(file: File): Promise<string>;
}
