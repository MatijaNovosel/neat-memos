export interface ResourceUploadReturnDto {
  id: string;
  url: string;
}

export interface ResourceFile {
  id: string;
  name: string;
  size: number;
  url: string;
  createdAt: string;
  memoId: number;
  cardId: number;
}

export interface ResourceFileDetailed extends ResourceFile {
  downloading: boolean;
}
