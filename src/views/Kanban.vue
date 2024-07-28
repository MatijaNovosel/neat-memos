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
    <v-window v-model="state.tab">
      <v-window-item
        v-for="project in state.projects"
        :key="`tabItem_${project.id}`"
        :value="project.id"
      >
        <div
          @wheel="(e) => scrollProject(e, project.id)"
          :id="`project-${project.id}`"
          class="bg-grey-lighten-3 mt-5 mx-0 pt-5 px-5 pb-2 d-flex kanban-projects rounded-lg"
        >
          <container
            v-for="column in project.columns"
            class="kanban-column"
            :key="column.id"
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
              <kanban-card :data="card" />
            </draggable>
          </container>
        </div>
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script setup lang="ts">
import KanbanCard from "@/components/kanban/KanbanCard.vue";
import { KANBAN_PROJECTS } from "@/constants/kanban";
import { DropResult } from "@/models/common";
import { Card, Project } from "@/models/kanban";
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

const applyDrag = (arr: Card[], dropResult: DropResult<Card>) => {
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

const onDrop = (projectId: number, columnId: number, dropResult: DropResult<Card>) => {
  const project = state.projects.find((p) => p.id === projectId);
  if (project) {
    const column = project.columns.find((c) => c.id === columnId);
    if (column) {
      column.cards = applyDrag(column.cards, dropResult);
    }
  }
};

const scrollProject = function (e: WheelEvent, projectId: number) {
  e.preventDefault();
  const element = document.getElementById(`project-${projectId}`);
  if (element) element.scrollLeft += e.deltaY;
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

.ghost {
  background: #2e3f47;
  opacity: 1;
  transform: rotate(30);
}
</style>
