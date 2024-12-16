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
  memoId: number | null;
  cardId: number | null;
}

export interface ResourceFileDetailed extends ResourceFile {
  downloading: boolean;
}
