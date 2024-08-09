import {
  CreateColumnModel,
  CreateProjectModel,
  MoveCardToColumnModel,
  MovePosition,
  ProjectModel
} from "@/models/kanban";

export interface IKanbanService {
  // Projects
  getProjects(userId: string): Promise<ProjectModel[]>;
  getProject(id: number): Promise<ProjectModel | null>;
  createProject(data: CreateProjectModel): Promise<number>;
  rearrangeColumns(positions: MovePosition[]): Promise<void>;
  // Columns
  createColumn(data: CreateColumnModel): Promise<number>;
  deleteColumn(columnId: number): Promise<void>;
  changeColumnName(columnId: number, name: string): Promise<void>;
  // Cards
  moveCardToColumn(data: MoveCardToColumnModel): Promise<void>;
  rearrangeCardsInColumn(data: MovePosition[]): Promise<void>;
}
