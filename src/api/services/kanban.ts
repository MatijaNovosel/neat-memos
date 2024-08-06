import supabase from "@/helpers/supabase";
import { CreateProjectModel, ProjectModel } from "@/models/kanban";
import { IKanbanService } from "../interfaces/kanban";

export class KanbanService implements IKanbanService {
  async getProjects(userId: string): Promise<ProjectModel[]> {
    const { data, error } = await supabase
      .from("projects")
      .select("id, createdAt, userId, name")
      .eq("userId", userId);

    if (error) throw error;
    if (!data) return [];

    return data;
  }

  async getProject(id: number): Promise<ProjectModel | null> {
    const { data, error } = await supabase
      .from("projects")
      .select("id, createdAt, name, userId")
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
