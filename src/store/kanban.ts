import { Card } from "@/models/kanban";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useKanbanStore = defineStore("kanban", () => {
  const detailsDialog = ref<boolean>(false);
  const activeCard = ref<Card | null>(null);

  return {
    detailsDialog,
    activeCard
  };
});
