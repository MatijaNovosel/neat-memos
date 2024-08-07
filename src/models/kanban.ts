import { TagModel } from "./tag";

export interface CardModel {
  id: number;
  name: string;
  tags: TagModel[];
  coverColor: string | null;
  coverUrl: string | null;
  description: string | null;
}

export interface ColumnModel {
  id: number;
  name: string;
  position: number;
  projectId: number;
  cards: CardModel[];
}

export interface CreateProjectModel {
  name: string;
  userId: string;
}

export interface ProjectModel {
  id: number;
  name: string;
  userId: string;
  columns: ColumnModel[];
}
