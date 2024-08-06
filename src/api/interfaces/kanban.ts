import { CreateProjectModel, ProjectModel } from "@/models/kanban";

export interface IKanbanService {
  getProjects(userId: string): Promise<ProjectModel[]>;
  getProject(id: number): Promise<ProjectModel | null>;
  saveProject(data: CreateProjectModel): Promise<number>;
}
