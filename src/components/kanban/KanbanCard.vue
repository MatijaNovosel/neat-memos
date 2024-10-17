<template>
  <div
    @click="openDetailsDialog"
    class="mb-2 kanban-card-wrapper"
  >
    <v-card
      rounded
      class="pa-0 kanban-card"
      flat
    >
      <div
        class="overlay"
        v-if="matchesSearch"
      />
      <div>
        <slot name="default" />
      </div>
      <v-toolbar
        v-if="props.data.coverColor"
        :style="{
          backgroundColor: props.data.coverColor
        }"
        class="mb-1"
        height="10"
      />
      <div
        v-if="props.data.coverUrl"
        class="mb-1"
        :style="coverStyle"
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
      <v-card-text class="pb-3">
        {{ props.data.name }}
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { CardModel } from "@/models/kanban";
import { useKanbanStore } from "@/store/kanban";
import { computed } from "vue";

const props = defineProps<{
  data: CardModel;
}>();

const kanbanStore = useKanbanStore();

const openDetailsDialog = () => {
  kanbanStore.activeCard = { ...props.data };
  kanbanStore.kanbanCardDialog = true;
};

const coverStyle = computed(() => ({
  height: "110px",
  backgroundImage: `url(${props.data.coverUrl}) center/cover no-repeat`
}));

const matchesSearch = computed(
  () =>
    kanbanStore.searchText &&
    props.data.name.toLowerCase().includes(kanbanStore.searchText.toLowerCase())
);
</script>

<style scoped>
.labels {
  gap: 8px;
  flex-wrap: wrap;
}

.kanban-card {
  cursor: pointer;
}

.kanban-card-wrapper {
  border: 1px solid transparent;
  border-radius: 4px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.kanban-card-wrapper:hover {
  border: 1px solid #e4780b;
  border-radius: 4px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.overlay {
  background-color: #14ea144a;
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
