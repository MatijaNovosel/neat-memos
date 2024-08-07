import supabase from "@/helpers/supabase";
import { CreateColumnModel, CreateProjectModel, ProjectModel } from "@/models/kanban";
import { IKanbanService } from "../interfaces/kanban";

export class KanbanService implements IKanbanService {
  async createColumn(data: CreateColumnModel): Promise<number> {
    const { data: response, error } = await supabase
      .from("columns")
      .insert([
        {
          name: data.name,
          position: data.position,
          projectId: data.projectId
        }
      ])
      .select();

    const id = response![0].id;

    if (error) throw error;

    return id;
  }

  async getProjects(userId: string): Promise<ProjectModel[]> {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        id,
        createdAt,
        userId,
        name,
        columns (
          id,
          name,
          position,
          projectId,
          cards (
            id,
            createdAt,
            coverColor,
            coverUrl,
            name,
            description,
            columnId,
            tags (
              id,
              content,
              color
            )
          )
        )`
      )
      .eq("userId", userId);

    if (error) throw error;
    if (!data) return [];

    return data;
  }

  async getProject(id: number): Promise<ProjectModel | null> {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        id,
        createdAt,
        userId,
        name,
        columns (
          id,
          name,
          position,
          projectId,
          cards (
            id,
            createdAt,
            coverColor,
            coverUrl,
            name,
            description,
            columnId,
            tags (
              id,
              content,
              color
            )
          )
        )`
      )
      .eq("id", id);

    if (error) throw error;
    if (!data) return null;

    return data[0];
  }

  async saveProject(data: CreateProjectModel): Promise<number> {
    const { data: response, error } = await supabase
      .from("projects")
      .insert([
        {
          name: data.name,
          userId: data.userId
        }
      ])
      .select();

    const id = response![0].id;

    if (error) throw error;

    return id;
  }
}
