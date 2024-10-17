import { KanbanService } from "@/api/services/kanban";
import {
  CardModel,
  CreateCardModel,
  EditCardModel,
  MoveCardToColumnModel,
  MovePosition,
  ProjectModel
} from "@/models/kanban";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
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
  const searchText = ref<string | null>(null);

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
        c.cards = c.cards.map((card) => {
          card.menuOpen = false;
          return card;
        });
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
        name: data.name,
        position: data.position,
        tags: data.tags,
        createdAt: new Date().toISOString()
      });
    loading.value = false;
  };

  const deleteColumn = async (columnId: number, positions: MovePosition[]) => {
    loading.value = true;
    await kanbanService.deleteColumn(columnId, positions);
    loading.value = false;
  };

  const deleteCard = async (cardId: number, positions: MovePosition[]) => {
    loading.value = true;
    await kanbanService.deleteCard(cardId, positions);
    loading.value = false;
  };

  const editKanbanCard = async (data: EditCardModel) => {
    loading.value = true;
    await kanbanService.editCard(data);
    loading.value = false;
  };

  const deleteProject = async (projectId: number) => {
    loading.value = true;
    await kanbanService.deleteProject(projectId);
    projects.value = projects.value.filter((p) => p.id !== projectId);
    selectedProject.value = projects.value[0].id;
    loading.value = false;
  };

  const interactionsDisabled = computed(() => {
    return searchText.value !== "" && searchText.value !== null;
  });

  const filteredProjects = computed(() => {
    if (searchText.value !== "" && searchText.value !== null) {
      const result: ProjectModel[] = [];

      projects.value.forEach((project) => {
        const filteredProject = { ...project };
        filteredProject.columns = filteredProject.columns.filter((column) =>
          column.cards.some(
            (card) =>
              card.name.toLowerCase().includes(searchText.value!.toLowerCase()) ||
              card.tags.some((tag) =>
                tag.content.toLowerCase().includes(searchText.value!.toLowerCase())
              )
          )
        );
        result.push(filteredProject);
      });

      return result;
    } else {
      return projects.value;
    }
  });

  return {
    kanbanCardDialog,
    projectDialog,
    columnDialog,
    activeCard,
    projects,
    selectedProject,
    loading,
    activeColumnId,
    searchText,
    filteredProjects,
    interactionsDisabled,
    deleteProject,
    editKanbanCard,
    deleteCard,
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
