<template>
  <v-container class="main-ctr">
    <mobile-drawer-controls hide-right />
    <div class="d-flex justify-space-between align-center">
      <template v-if="state.projects.length">
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
      </template>
      <span
        class="text-grey-lighten-1 text-h6"
        v-else
      >
        No projects found.
      </span>
      <v-btn
        color="green"
        icon="mdi-plus"
        rounded="0"
        variant="tonal"
        size="small"
      />
    </div>
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
              <div class="font-weight-bold text-white bg-orange-lighten-2 py-3 pos-rel rounded-t">
                <v-text-field
                  class="px-5"
                  hide-details
                  v-model="column.name"
                  density="compact"
                  variant="solo"
                >
                  <template #append>
                    <v-btn
                      variant="text"
                      size="small"
                      color="white"
                      icon="mdi-dots-horizontal"
                    />
                  </template>
                </v-text-field>
              </div>
              <v-divider color="white" />
              <container
                tag="div"
                class="kanban-column bg-orange-lighten-3 px-5 rounded-b pb-2 pt-3"
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
import { randInt } from "@/helpers/math";
import { sample } from "@/helpers/misc";
import { DropResult } from "@/models/common";
import { Card, CardCover, Column, Project } from "@/models/kanban";
import { TagModel } from "@/models/tag";
import { useMemoStore } from "@/store/memos";
import { onMounted, reactive } from "vue";
import { Container, Draggable } from "vue3-smooth-dnd";

const memoStore = useMemoStore();

interface State {
  projects: Project[];
  tab: number | null;
}

const dropPlaceholderOptions = {
  className: "drop-preview",
  animationDuration: "150",
  showOnTop: true
};

const state: State = reactive({
  projects: [],
  tab: null
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

onMounted(() => {
  for (let i = 0; i < 3; i++) {
    const columns: Column[] = [];

    for (let j = 0; j < 5; j++) {
      const cards: Card[] = [];
      const numberOfCards = randInt(2, 10);

      for (let k = 0; k < numberOfCards; k++) {
        const numberOfTags = randInt(1, 4);
        const cardId = randInt(1, 99999);
        const shouldHaveCover = randInt(1, 4) === 2;
        const tags: TagModel[] = [];

        let cover: CardCover | undefined = undefined;

        for (let l = 0; l < numberOfTags; l++) {
          const randTag = sample(memoStore.tags);
          if (!tags.find((t) => t.id === randTag.id)) {
            tags.push(randTag);
          }
        }

        if (shouldHaveCover) {
          const coverIsImage = randInt(1, 3) === 3;
          if (coverIsImage) {
            cover = {
              imageUrl:
                "https://i0.wp.com/nftartwithlauren.com/wp-content/uploads/2023/11/laurenmcdonaghpereiraphoto_A_field_of_blooming_sunflowers_und_40d30d23-9ecd-489f-a2b9-5a8f7293af9a_0.png?fit=1024%2C574&ssl=1"
            };
          } else {
            cover = {
              color: sample([
                "#E53935",
                "#EC407A",
                "#AB47BC",
                "#7E57C2",
                "#42A5F5",
                "#4DD0E1",
                "#4DB6AC",
                "#66BB6A"
              ])
            };
          }
        }

        cards.push({
          id: cardId,
          name: `Card ${cardId}`,
          tags,
          cover
        });
      }

      const columnId = randInt(1, 99999);

      columns.push({
        id: columnId,
        cards,
        name: `Column ${columnId}`
      });
    }

    const projectId = randInt(1, 99999);

    state.projects.push({
      columns,
      id: projectId,
      name: `Project ${projectId}`
    });
  }
});
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
