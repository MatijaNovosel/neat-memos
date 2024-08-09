import { KanbanService } from "@/api/services/kanban";
import {
  CardModel,
  CreateCardModel,
  MoveCardToColumnModel,
  MovePosition,
  ProjectModel
} from "@/models/kanban";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useUserStore } from "./user";

export const useKanbanStore = defineStore("kanban", () => {
  const kanbanCardDialog = ref<boolean>(false);
  const activeCard = ref<CardModel | null>(null);
  const projectDialog = ref(false);
  const activeColumnId = ref<number | null>(null);
  const loading = ref(false);
  const columnDialog = ref(false);
  const projects = ref<ProjectModel[]>([]);
  const selectedProject = ref<number | null>(null);

  const kanbanService = new KanbanService();

  const userStore = useUserStore();

  const loadProjects = async () => {
    if (!userStore.user) {
      return;
    }
    loading.value = true;
    const data = await kanbanService.getProjects(userStore.user.id);
    projects.value = data.map((p) => {
      p.columns.sort((a, b) => a.position - b.position);
      p.columns.forEach((c) => {
        c.cards.sort((a, b) => a.position - b.position);
      });
      return p;
    });
    loading.value = false;
  };

  const createProject = async (name: string) => {
    if (!userStore.user) {
      return;
    }
    loading.value = true;
    const id = await kanbanService.createProject({
      name,
      userId: userStore.user.id
    });
    projects.value.push({
      id,
      columns: [],
      name,
      userId: userStore.user.id
    });
    loading.value = false;
  };

  const createColumn = async (name: string, position: number, projectId: number) => {
    loading.value = true;
    const id = await kanbanService.createColumn({
      name,
      position,
      projectId
    });
    const activeProject = projects.value.find((p) => p.id === projectId);
    if (activeProject) {
      activeProject.columns.push({
        cards: [],
        id,
        name,
        position,
        projectId
      });
    }
    loading.value = false;
  };

  const moveCardToColumn = async (data: MoveCardToColumnModel) => {
    loading.value = true;
    await kanbanService.moveCardToColumn(data);
    loading.value = false;
  };

  const rearrangeCardsInColumn = async (cardPositions: MovePosition[]) => {
    loading.value = true;
    await kanbanService.rearrangeCardsInColumn(cardPositions);
    loading.value = false;
  };

  const rearrangeColumns = async (positions: MovePosition[]) => {
    loading.value = true;
    await kanbanService.rearrangeColumns(positions);
    loading.value = false;
  };

  const changeColumnName = async (columnId: number, name: string) => {
    loading.value = true;
    await kanbanService.changeColumnName(columnId, name);
    loading.value = false;
  };

  const createCard = async (data: CreateCardModel) => {
    loading.value = true;
    const id = await kanbanService.createCard(data);
    const project = projects.value.find((p) => p.id === data.projectId);
    project?.columns
      .find((c) => c.id === data.columnId)
      ?.cards.push({
        id,
        columnId: data.columnId,
        coverColor: data.coverColor,
        coverUrl: data.coverUrl,
        description: data.description,
        name: data.title,
        position: data.position,
        tags: []
      });
    loading.value = false;
  };

  const deleteColumn = async (columnId: number) => {
    //
  };

  return {
    kanbanCardDialog,
    projectDialog,
    columnDialog,
    activeCard,
    projects,
    selectedProject,
    loading,
    activeColumnId,
    createCard,
    rearrangeColumns,
    changeColumnName,
    rearrangeCardsInColumn,
    deleteColumn,
    loadProjects,
    createProject,
    createColumn,
    moveCardToColumn
  };
});
