export interface MemoModel {
  id: number;
  createdAt: string;
  userId: string;
  content: string;
  pinned: boolean;
}

export interface CreateMemoModel {
  content: string;
  userId: string;
}
