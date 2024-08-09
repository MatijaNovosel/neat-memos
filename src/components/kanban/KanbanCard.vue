<template>
  <v-card
    rounded
    class="pa-0 mb-3 kanban-card"
    flat
  >
    <div>
      <slot name="default" />
    </div>
    <v-toolbar
      v-if="props.data.coverColor"
      :style="{
        backgroundColor: props.data.coverColor
      }"
      class="mb-1"
      height="15"
    />
    <div
      v-if="props.data.coverUrl"
      class="mb-1"
      :style="{
        height: '110px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundImage: `url(${props.data.coverUrl})`
      }"
    />
    <v-card-title
      class="d-flex labels mt-2"
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
import { CardModel } from "@/models/kanban";
import { useKanbanStore } from "@/store/kanban";

const props = defineProps<{
  data: CardModel;
}>();

const kanbanStore = useKanbanStore();

const openDetailsDialog = () => {
  kanbanStore.activeCard = { ...props.data };
  kanbanStore.kanbanCardDialog = true;
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
