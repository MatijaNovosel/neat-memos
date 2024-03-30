import { CreateTagModel, TagModel, UpdateTagModel } from "@/models/tag";

export interface ITagService {
  getTags(userId: string): Promise<TagModel[]>;
  saveTag(data: CreateTagModel): Promise<number>;
  editTag(data: UpdateTagModel): Promise<void>;
  deleteTag(id: number): Promise<void>;
}
