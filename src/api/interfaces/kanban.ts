import { CreateColumnModel, CreateProjectModel, ProjectModel } from "@/models/kanban";

export interface IKanbanService {
  // Projects
  getProjects(userId: string): Promise<ProjectModel[]>;
  getProject(id: number): Promise<ProjectModel | null>;
  saveProject(data: CreateProjectModel): Promise<number>;
  // Columns
  createColumn(data: CreateColumnModel): Promise<number>;
}
