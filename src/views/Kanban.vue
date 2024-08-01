<template>
  <v-container class="main-ctr">
    <mobile-drawer-controls hide-right />
    <v-tabs
      v-model="state.tab"
      align-tabs="center"
      color="orange"
    >
      <v-tab
        v-for="project in state.projects"
        :key="project.id"
        rounded="0"
        :value="project.id"
      >
        {{ project.name }}
      </v-tab>
    </v-tabs>
    <v-window
      v-model="state.tab"
      class="project-window mt-5"
    >
      <v-window-item
        v-for="project in state.projects"
        :key="`tabItem_${project.id}`"
        :value="project.id"
        class="h-100"
      >
        <div
          :id="`project-${project.id}`"
          class="bg-grey-lighten-3 mx-0 pt-5 px-5 pb-4 d-flex kanban-projects rounded-lg h-100"
        >
          <container
            tag="div"
            class="d-flex flex-gap h-fit-content"
            group-name="cols"
            orientation="horizontal"
            @drop="(e) => onColumnDrop(project.id, e)"
          >
            <draggable
              v-for="column in project.columns"
              :key="column.id"
              class="column-ctr"
            >
              <div
                class="d-flex font-weight-bold justify-start text-white bg-orange-lighten-3 pb-4 pt-5 pos-rel rounded-t"
              >
                <span class="pl-5">
                  {{ column.name }}
                </span>
                <v-btn
                  class="top-right-btn"
                  variant="text"
                  size="small"
                  color="white"
                  icon="mdi-dots-horizontal"
                />
              </div>
              <container
                tag="div"
                class="kanban-column bg-orange-lighten-3 px-5 rounded-b pb-2"
                :get-child-payload="getCardPayload(project.id, column.id)"
                orientation="vertical"
                :group-name="project.name"
                @drop="(result) => onDrop(project.id, column.id, result)"
                drag-class="card-ghost"
                drop-class="card-ghost-drop"
                :drop-placeholder="dropPlaceholderOptions"
              >
                <draggable
                  v-for="card in column.cards"
                  :key="card.id"
                >
                  <kanban-card
                    v-if="card"
                    :data="card"
                  />
                </draggable>
              </container>
            </draggable>
          </container>
        </div>
      </v-window-item>
    </v-window>
  </v-container>
  <details-dialog />
</template>

<script setup lang="ts">
import DetailsDialog from "@/components/kanban/DetailsDialog.vue";
import KanbanCard from "@/components/kanban/KanbanCard.vue";
import { KANBAN_PROJECTS } from "@/constants/kanban";
import { DropResult } from "@/models/common";
import { Card, Column, Project } from "@/models/kanban";
import { reactive } from "vue";
import { Container, Draggable } from "vue3-smooth-dnd";

interface State {
  projects: Project[];
  tab: number;
}

const dropPlaceholderOptions = {
  className: "drop-preview",
  animationDuration: "150",
  showOnTop: true
};

const state: State = reactive({
  projects: [...KANBAN_PROJECTS],
  tab: KANBAN_PROJECTS[0].id
});

const applyDrag = <T>(arr: T[], dropResult: DropResult<T>): T[] => {
  const { removedIndex, addedIndex, payload } = dropResult;
  if (removedIndex === null && addedIndex === null) return arr;
  const result = [...arr];
  let itemToAdd = payload;
  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }
  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }
  return result;
};

const onDrop = <T extends Card>(projectId: number, columnId: number, dropResult: DropResult<T>) => {
  if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
    const project = state.projects.find((p) => p.id === projectId);
    if (project) {
      const column = project.columns.filter((p) => p.id === columnId)[0];
      const itemIndex = project.columns.indexOf(column);
      const newColumn = Object.assign({}, column);
      newColumn.cards = applyDrag<Card>(newColumn.cards, dropResult);
      project.columns.splice(itemIndex, 1, newColumn);
    }
  }
};

const getCardPayload = (projectId: number, columnId: number) => {
  return (index: number) => {
    const project = state.projects.find((p) => p.id === projectId);
    return project?.columns.filter((p) => p.id === columnId)[0].cards[index];
  };
};

const onColumnDrop = (projectId: number, dropResult: DropResult<Column>) => {
  const project = state.projects.find((p) => p.id === projectId);
  if (project) {
    project.columns = applyDrag(project.columns, dropResult);
  }
};
</script>

<style scoped>
.kanban-column {
  width: 300px;
  flex-shrink: 0;
  box-sizing: border-box;
}

.kanban-projects {
  gap: 20px;
  overflow: auto;
}

.column-ctr {
  cursor: pointer;
  height: fit-content;
}

.top-right-btn {
  position: absolute;
  top: 10px;
  right: 15px;
}

.project-window {
  height: calc(100vh - 110px);
  overflow: auto;
}
</style>
