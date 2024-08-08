import { KanbanService } from "@/api/services/kanban";
import {
  CardModel,
  ColumnCardPosition,
  MoveCardToColumnModel,
  ProjectModel
} from "@/models/kanban";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useUserStore } from "./user";

export const useKanbanStore = defineStore("kanban", () => {
  const detailsDialog = ref<boolean>(false);
  const activeCard = ref<CardModel | null>(null);
  const projectDialog = ref(false);
  const columnDialog = ref(false);
  const projects = ref<ProjectModel[]>([]);
  const selectedProject = ref<number | null>(null);

  const kanbanService = new KanbanService();

  const userStore = useUserStore();

  const loadProjects = async () => {
    if (!userStore.user) {
      return;
    }
    const data = await kanbanService.getProjects(userStore.user.id);
    projects.value = data.map((p) => {
      p.columns.sort((a, b) => a.position - b.position);
      p.columns.forEach((c) => {
        c.cards.sort((a, b) => a.position - b.position);
      });
      return p;
    });
  };

  const createProject = async (name: string) => {
    if (!userStore.user) {
      return;
    }
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
  };

  const createColumn = async (name: string, position: number, projectId: number) => {
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
  };

  const moveCardToColumn = async (data: MoveCardToColumnModel) => {
    await kanbanService.moveCardToColumn(data);
  };

  const rearrangeCardsInColumn = async (cardPositions: ColumnCardPosition[]) => {
    await kanbanService.rearrangeCardsInColumn(cardPositions);
  };

  const deleteColumn = async (columnId: number) => {
    //
  };

  return {
    detailsDialog,
    projectDialog,
    columnDialog,
    activeCard,
    projects,
    selectedProject,
    rearrangeCardsInColumn,
    deleteColumn,
    loadProjects,
    createProject,
    createColumn,
    moveCardToColumn
  };
});
