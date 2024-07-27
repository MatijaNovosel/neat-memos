<template>
  <v-container class="main-ctr">
    <mobile-drawer-controls hide-right />
    <div
      class="bg-grey-lighten-3 outline mt-5 mx-0 pt-5 px-5 pb-2 d-flex kanban-projects"
      v-for="project in state.projects"
      :key="project.id"
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
  </v-container>
</template>

<script setup lang="ts">
import KanbanCard from "@/components/kanban/KanbanCard.vue";
import { DropResult } from "@/models/common";
import { Card, Project } from "@/models/kanban";
import { reactive } from "vue";
import { Container, Draggable } from "vue3-smooth-dnd";

interface State {
  projects: Project[];
}

const dropPlaceholderOptions = {
  className: "drop-preview",
  animationDuration: "150",
  showOnTop: true
};

const state: State = reactive({
  projects: [
    {
      columns: [
        {
          cards: [
            {
              id: 1,
              name: "Card 1"
            },
            {
              id: 2,
              name: "Card 2"
            },
            {
              id: 3,
              name: "Card 3"
            }
          ],
          id: 1,
          name: "Column 1"
        },
        {
          cards: [
            {
              id: 1,
              name: "Card 1"
            },
            {
              id: 2,
              name: "Card 2"
            },
            {
              id: 3,
              name: "Card 3"
            }
          ],
          id: 2,
          name: "Column 2"
        },
        {
          cards: [
            {
              id: 1,
              name: "Card 1"
            },
            {
              id: 2,
              name: "Card 2"
            },
            {
              id: 3,
              name: "Card 3"
            }
          ],
          id: 3,
          name: "Column 3"
        },
        {
          cards: [
            {
              id: 1,
              name: "Card 1"
            },
            {
              id: 2,
              name: "Card 2"
            },
            {
              id: 3,
              name: "Card 3"
            }
          ],
          id: 4,
          name: "Column 4"
        }
      ],
      id: 1,
      name: "Project 1"
    }
  ]
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
