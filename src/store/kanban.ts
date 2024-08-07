import { KanbanService } from "@/api/services/kanban";
import { CardModel, ProjectModel } from "@/models/kanban";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useUserStore } from "./user";

export const useKanbanStore = defineStore("kanban", () => {
  const detailsDialog = ref<boolean>(false);
  const activeCard = ref<CardModel | null>(null);
  const projectDialog = ref(false);
  const columnDialog = ref(false);
  const projects = ref<ProjectModel[]>([]);

  const kanbanService = new KanbanService();

  const userStore = useUserStore();

  const loadProjects = async () => {
    if (!userStore.user) {
      return;
    }
    const data = await kanbanService.getProjects(userStore.user.id);
    projects.value = data;
  };

  const saveProject = async (name: string) => {
    if (!userStore.user) {
      return;
    }
    await kanbanService.saveProject({
      name,
      userId: userStore.user.id
    });
  };

  return {
    detailsDialog,
    projectDialog,
    columnDialog,
    activeCard,
    projects,
    loadProjects,
    saveProject
  };
});
