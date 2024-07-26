export interface Card {
  id: number;
  name: string;
}

export interface Column {
  id: number;
  name: string;
  cards: Card[];
}

export interface Project {
  id: number;
  name: string;
  columns: Column[];
}
