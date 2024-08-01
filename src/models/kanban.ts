export interface CardCover {
  imageUrl?: string;
  color?: string;
}

export interface Card {
  id: number;
  name: string;
  cover?: CardCover;
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
