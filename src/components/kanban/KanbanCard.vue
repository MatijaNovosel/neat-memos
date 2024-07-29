<template>
  <v-card
    @click="openDetailsDialog"
    rounded="md"
    class="pa-0 mb-3 kanban-card"
    flat
  >
    <v-card-title class="d-flex labels">
      <v-chip
        size="x-small"
        color="orange"
      >
        Todo
      </v-chip>
      <v-chip
        size="x-small"
        color="red"
      >
        Media
      </v-chip>
      <v-chip
        size="x-small"
        color="blue"
      >
        Movies
      </v-chip>
    </v-card-title>
    <v-card-text class="mt-1">
      {{ props.data.name }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { Card } from "@/models/kanban";
import { useKanbanStore } from "@/store/kanban";

const props = defineProps<{
  data: Card;
}>();

const kanbanStore = useKanbanStore();

const openDetailsDialog = () => {
  kanbanStore.activeCard = { ...props.data };
  kanbanStore.detailsDialog = true;
};
</script>

<style scoped>
.labels {
  gap: 8px;
  flex-wrap: wrap;
}

.kanban-card {
  cursor: pointer;
  border: 1px solid white;
}

.kanban-card:hover {
  border: 1px solid #e48435;
}
</style>
