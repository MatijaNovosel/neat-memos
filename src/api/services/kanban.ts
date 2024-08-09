import supabase from "@/helpers/supabase";
import {
  CreateCardModel,
  CreateColumnModel,
  CreateProjectModel,
  MoveCardToColumnModel,
  MovePosition,
  ProjectModel
} from "@/models/kanban";
import { IKanbanService } from "../interfaces/kanban";

export class KanbanService implements IKanbanService {
  async createCard(data: CreateCardModel): Promise<number> {
    const { data: response, error } = await supabase
      .from("cards")
      .insert([
        {
          columnId: data.columnId,
          coverColor: data.coverColor,
          coverUrl: data.coverUrl,
          description: data.description,
          name: data.title,
          position: data.position
        }
      ])
      .select();

    const id = response![0].id;

    if (error) throw error;

    return id;
  }

  async rearrangeColumns(positions: MovePosition[]): Promise<void> {
    const { error } = await supabase.from("columns").upsert(
      positions.map((d) => ({
        position: d.newPosition,
        id: d.id
      }))
    );

    if (error) throw error;
  }

  async changeColumnName(columnId: number, name: string): Promise<void> {
    const { error: error } = await supabase
      .from("columns")
      .update([
        {
          name
        }
      ])
      .eq("id", columnId);

    if (error) throw error;
  }

  async rearrangeCardsInColumn(data: MovePosition[]): Promise<void> {
    const { error } = await supabase.from("cards").upsert(
      data.map((d) => ({
        position: d.newPosition,
        id: d.id
      }))
    );
    if (error) throw error;
  }

  async moveCardToColumn(data: MoveCardToColumnModel): Promise<void> {
    const { error: cardMoveError } = await supabase
      .from("cards")
      .update([
        {
          columnId: data.newColumnId
        }
      ])
      .eq("id", data.cardId);

    if (cardMoveError) throw cardMoveError;

    const { error: cardRearrangeError } = await supabase.from("cards").upsert(
      data.positions.map((d) => ({
        position: d.newPosition,
        id: d.id
      }))
    );

    if (cardRearrangeError) throw cardRearrangeError;
  }

  async deleteColumn(columnId: number): Promise<void> {
    const { error } = await supabase.from("columns").delete().eq("id", columnId);
    if (error) throw error;
  }

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
            position,
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
            position,
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

  async createProject(data: CreateProjectModel): Promise<number> {
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
