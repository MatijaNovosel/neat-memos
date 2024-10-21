<template>
  <div
    @click="openDetailsDialog"
    class="mb-2 kanban-card"
  >
    <v-icon
      v-if="props.data.urgent"
      size="18"
      class="kanban-card-badge"
      color="red-lighten-2"
    >
      mdi-alert-circle
    </v-icon>
    <v-card
      rounded
      class="pa-0 kanban-card-inner pb-2"
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
      <v-card-text class="pt-1 pb-0">
        {{ props.data.name }}
      </v-card-text>
      <div
        v-if="props.data.rating"
        class="pl-4"
      >
        <v-rating
          half-increments
          disabled
          :model-value="props.data.rating"
          :length="5"
        >
          <template #item="{ value }">
            <v-icon
              :color="getRatingColor(value)"
              size="12"
            >
              mdi-circle
            </v-icon>
          </template>
        </v-rating>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { ratingColor } from "@/constants/kanban";
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

const getRatingColor = (value: number) => {
  const ratingValue = props.data.rating || 1;

  if (value > ratingValue) {
    return "grey-lighten-1";
  }

  return ratingColor[Math.ceil(ratingValue)];
};

const coverStyle = computed(() => ({
  height: "110px",
  backgroundImage: `url(${props.data.coverUrl}) center/cover no-repeat`
}));

const matchesSearch = computed(() => {
  const text = kanbanStore.searchText?.toLowerCase();

  if (text) {
    return (
      props.data.name.toLowerCase().includes(text) ||
      props.data.tags.some((tag) => tag.content.toLowerCase().includes(text))
    );
  }

  return false;
});
</script>

<style scoped lang="scss">
.labels {
  gap: 8px;
  flex-wrap: wrap;
}

.kanban-card {
  position: relative;
  border: 1.5px solid transparent;
  border-radius: 4px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  cursor: pointer;
  box-sizing: border-box;
  transition: border-color 0.2s ease-in;

  &-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 20;
  }

  &:hover {
    border: 1.5px solid #e4780b;
    border-radius: 4px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
}

.overlay {
  background-color: #14ea144a;
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
