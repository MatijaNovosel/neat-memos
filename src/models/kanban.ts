import { TagModel } from "./tag";

export interface CardModel {
  id: number;
  name: string;
  tags: TagModel[];
  coverColor: string | null;
  coverUrl: string | null;
  position: number;
  description: string | null;
  columnId: number;
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

export interface CreateColumnModel {
  name: string;
  projectId: number;
  position: number;
}

export interface MoveCardToColumnModel {
  cardId: number;
  positions: MovePosition[];
  newColumnId: number;
}

export interface MovePosition {
  newPosition: number;
  id: number;
}
