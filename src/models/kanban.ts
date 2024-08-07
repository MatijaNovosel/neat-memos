import { TagModel } from "./tag";

export interface CardCover {
  imageUrl?: string;
  color?: string;
}

export interface Card {
  id: number;
  name: string;
  tags: TagModel[];
  cover?: CardCover;
  description?: string;
}

export interface ColumnModel {
  id: number;
  name: string;
  position: number;
  projectId: number;
  cards: Card[];
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
