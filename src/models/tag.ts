export interface TagModel {
  id: number;
  content: string;
  color: string;
}

export interface CreateTagModel {
  content: string;
  color: string;
  userId: string;
}

export interface UpdateTagModel {
  id: string;
  content: string;
  color: string;
}
