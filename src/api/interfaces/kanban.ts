import {
  ColumnCardPosition,
  CreateColumnModel,
  CreateProjectModel,
  MoveCardToColumnModel,
  ProjectModel
} from "@/models/kanban";

export interface IKanbanService {
  // Projects
  getProjects(userId: string): Promise<ProjectModel[]>;
  getProject(id: number): Promise<ProjectModel | null>;
  createProject(data: CreateProjectModel): Promise<number>;
  // Columns
  createColumn(data: CreateColumnModel): Promise<number>;
  deleteColumn(columnId: number): Promise<void>;
  // Cards
  moveCardToColumn(data: MoveCardToColumnModel): Promise<void>;
  rearrangeCardsInColumn(data: ColumnCardPosition[]): Promise<void>;
}
