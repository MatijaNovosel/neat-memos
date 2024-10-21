import supabase from "@/helpers/supabase";
import {
  CreateCardModel,
  CreateColumnModel,
  CreateProjectModel,
  EditCardModel,
  MoveCardToColumnModel,
  MovePosition,
  ProjectModel
} from "@/models/kanban";
import { IKanbanService } from "../interfaces/kanban";

export class KanbanService implements IKanbanService {
  async deleteProject(projectId: number): Promise<void> {
    const { error } = await supabase.from("projects").delete().eq("id", projectId);
    if (error) throw error;
  }

  async addRating(cardId: number): Promise<void> {
    const { error } = await supabase
      .from("cards")
      .update({
        rating: 1
      })
      .eq("id", cardId);
    if (error) throw error;
  }

  async markAsUrgent(cardId: number, status: boolean): Promise<void> {
    const { error } = await supabase
      .from("cards")
      .update({
        urgent: !status
      })
      .eq("id", cardId);
    if (error) throw error;
  }

  async editCard(data: EditCardModel): Promise<void> {
    const { error } = await supabase
      .from("cards")
      .update({
        description: data.description,
        name: data.name,
        coverColor: data.coverColor,
        coverUrl: data.coverUrl,
        rating: data.rating
      })
      .eq("id", data.id);
    if (error) throw error;

    // Tag updating
    const tagIds = data.tags.map((x) => x.id);
    const initialTagIds = data.initialTags.map((x) => x.id);

    const idsToAdd = tagIds.filter((x) => !initialTagIds.includes(x));
    const idsToRemove = initialTagIds.filter((x) => !tagIds.includes(x));

    for (let i = 0; i < idsToRemove.length; i++) {
      const { error } = await supabase
        .from("cardTags")
        .delete()
        .eq("tagId", idsToRemove[i])
        .eq("cardId", data.id);
      if (error) throw error;
    }

    for (let i = 0; i < idsToAdd.length; i++) {
      const { error } = await supabase.from("cardTags").insert([
        {
          tagId: idsToAdd[i],
          cardId: data.id
        }
      ]);
      if (error) throw error;
    }
  }

  async deleteCard(cardId: number, positions: MovePosition[]): Promise<void> {
    const { error: cardDeleteError } = await supabase.from("cards").delete().eq("id", cardId);
    if (cardDeleteError) throw cardDeleteError;

    const { error } = await supabase.from("cards").upsert(
      positions.map((d) => ({
        position: d.newPosition,
        id: d.id
      }))
    );

    if (error) throw error;
  }

  async createCard(data: CreateCardModel): Promise<number> {
    const { data: response, error } = await supabase
      .from("cards")
      .insert([
        {
          columnId: data.columnId,
          coverColor: data.coverColor,
          coverUrl: data.coverUrl,
          description: data.description,
          name: data.name,
          position: data.position
        }
      ])
      .select();

    const id = response![0].id;

    if (error) throw error;

    for (let i = 0; i < data.tags.length; i++) {
      const { error } = await supabase
        .from("cardTags")
        .insert([
          {
            tagId: data.tags[i].id,
            cardId: id
          }
        ])
        .select();
      if (error) throw error;
    }

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

  async deleteColumn(columnId: number, positions: MovePosition[]): Promise<void> {
    const { error } = await supabase.from("columns").delete().eq("id", columnId);
    if (error) throw error;

    const { error: rearrangeError } = await supabase.from("columns").upsert(
      positions.map((d) => ({
        position: d.newPosition,
        id: d.id
      }))
    );

    if (rearrangeError) throw rearrangeError;
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
            urgent,
            rating,
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
            urgent,
            rating,
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
