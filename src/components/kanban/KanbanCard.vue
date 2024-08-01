<template>
  <v-card
    rounded
    class="pa-0 mb-3 kanban-card"
    flat
  >
    <v-toolbar
      v-if="props.data.cover && props.data.cover.color"
      :style="{
        backgroundColor: props.data.cover.color
      }"
      class="mb-1"
      height="15"
    />
    <div
      v-if="props.data.cover && props.data.cover.imageUrl"
      class="mb-1"
      :style="{
        height: '110px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundImage: `url(${props.data.cover?.imageUrl})`
      }"
    />
    <v-card-title
      class="d-flex labels"
      v-if="props.data.tags.length"
    >
      <v-chip
        v-for="label in props.data.tags"
        :key="label.id"
        size="x-small"
        :color="label.color"
      >
        {{ label.content }}
      </v-chip>
    </v-card-title>
    <v-card-text
      @click="openDetailsDialog"
      class="mt-1"
    >
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
}
</style>
