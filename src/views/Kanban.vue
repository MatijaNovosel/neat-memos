<template>
  <v-container class="main-ctr">
    <mobile-drawer-controls hide-right />
    <div
      class="bg-grey-lighten-3 outline mt-5 mx-0 pt-5 px-5 pb-2 d-flex kanban-projects"
      v-for="project in state.projects"
      :key="project.id"
    >
      <div
        v-for="column in project.columns"
        class="kanban-column"
        :key="column.id"
      >
        <draggable
          v-model="column.cards"
          group="people"
          @start="drag = true"
          @end="drag = false"
          item-key="id"
        >
          <template #item="{ element }">
            <v-card
              class="pa-5 mb-3"
              flat
              border
            >
              {{ element.id }}
            </v-card>
          </template>
        </draggable>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { Project } from "@/models/kanban";
import { reactive, ref } from "vue";
import draggable from "vuedraggable";

interface State {
  projects: Project[];
}

const drag = ref(false);

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
</script>

<style scoped>
.kanban-column {
  width: 500px;
}

.kanban-projects {
  gap: 20px;
  overflow-x: auto;
}
</style>
