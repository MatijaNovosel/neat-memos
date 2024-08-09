<template>
  <v-container>
    <mobile-drawer-controls hide-right />
    <div class="d-flex justify-space-between align-center">
      <template v-if="kanbanStore.projects.length">
        <v-tabs
          v-model="kanbanStore.selectedProject"
          align-tabs="center"
          color="orange"
        >
          <v-tab
            v-for="project in kanbanStore.projects"
            :key="project.id"
            rounded="0"
            :value="project.id"
            class="text-transform-inh"
          >
            <span class="mr-2">
              {{ project.name }}
            </span>
            <v-btn
              icon="mdi-close-circle"
              density="compact"
              color="grey"
              variant="text"
              size="small"
              @click="deleteProject"
            />
          </v-tab>
        </v-tabs>
      </template>
      <span
        class="text-grey-lighten-1 text-h6"
        v-else
      >
        No projects found.
      </span>
      <div class="d-flex flex-gap">
        <v-btn
          :loading="kanbanStore.loading"
          :disabled="kanbanStore.loading"
          color="green"
          icon="mdi-plus"
          rounded="0"
          variant="tonal"
          size="small"
          @click="kanbanStore.projectDialog = true"
        />
        <v-btn
          :loading="kanbanStore.loading"
          :disabled="kanbanStore.loading"
          color="blue"
          icon="mdi-table-column-plus-before"
          rounded="0"
          variant="tonal"
          size="small"
          @click="kanbanStore.columnDialog = true"
        />
      </div>
    </div>
    <v-row v-if="state.loading">
      <v-progress-circular
        class="my-6 mx-auto"
        color="orange"
        size="50"
        indeterminate
      />
    </v-row>
    <v-window
      v-if="!state.loading"
      v-model="kanbanStore.selectedProject"
      class="project-window mt-5"
    >
      <v-window-item
        v-for="project in kanbanStore.projects"
        :transition="false"
        :reverse-transition="false"
        :key="`tabItem_${project.id}`"
        :value="project.id"
        class="h-100"
      >
        <div
          :id="`project-${project.id}`"
          class="bg-grey-lighten-3 pt-5 px-5 pb-4 d-flex kanban-projects rounded-lg h-100"
        >
          <container
            lock-axis="x"
            @drag-start="onDragColumnStart"
            @drag-end="onDragColumnEnd"
            tag="div"
            class="d-flex flex-gap h-fit-content"
            group-name="cols"
            orientation="horizontal"
            :get-child-payload="getColumnPayload(project.id)"
            @drop="(e) => onColumnDrop(project.id, e)"
          >
            <draggable
              v-for="column in project.columns"
              :key="column.id"
              class="column-ctr"
            >
              <div class="font-weight-bold text-white bg-orange-lighten-2 py-3 pos-rel rounded-t">
                <v-text-field
                  :readonly="state.draggingColumn"
                  class="px-5 text-white"
                  hide-details
                  v-model="column.name"
                  bg-color="orange-lighten-2"
                  density="compact"
                  flat
                  @update:modelValue="(e: string) => updateColumnName(column.id, e)"
                  variant="solo"
                >
                  <template #append>
                    <v-btn
                      variant="text"
                      size="small"
                      color="white"
                      icon
                    >
                      <v-icon> mdi-dots-horizontal </v-icon>
                      <v-menu activator="parent">
                        <v-list
                          border
                          elevation="0"
                          density="compact"
                          class="py-0"
                        >
                          <v-list-item
                            class="text-caption"
                            v-for="(item, i) in columnActions"
                            @click="handleColumnAction(item.type, column.id)"
                            :key="i"
                          >
                            <v-icon
                              :color="item.color"
                              class="mr-3"
                            >
                              {{ item.icon }}
                            </v-icon>
                            <span>
                              {{ item.text }}
                            </span>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-btn>
                  </template>
                </v-text-field>
              </div>
              <v-divider color="white" />
              <container
                tag="div"
                :class="{
                  'pt-10': !column.cards.length
                }"
                class="kanban-column bg-orange-lighten-3 px-5 rounded-b pb-2 pt-3"
                :get-child-payload="getCardPayload(project.id, column.id)"
                orientation="vertical"
                :group-name="project.name"
                @drop="(result) => onCardDrop(project.id, column.id, result)"
                @drag-start="onDragCardStart"
                @drag-end="onDragCardEnd"
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
                    @click.right.prevent="card.menuOpen = true"
                    :data="card"
                  >
                    <v-menu
                      transition="scale-transition"
                      location="end"
                      v-model="card.menuOpen"
                      activator="parent"
                    >
                      <v-list
                        border
                        elevation="0"
                        density="compact"
                        class="py-0"
                      >
                        <v-list-item
                          class="text-caption"
                          v-for="(item, i) in cardActions"
                          @click="handleCardAction(item.type, column.id)"
                          :key="i"
                        >
                          <v-icon
                            :color="item.color"
                            class="mr-3"
                          >
                            {{ item.icon }}
                          </v-icon>
                          <span>
                            {{ item.text }}
                          </span>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </kanban-card>
                </draggable>
              </container>
              <div class="d-flex justify-center mt-3">
                <v-btn
                  variant="outlined"
                  color="orange"
                  size="small"
                  prepend-icon="mdi-plus"
                  rounded="8"
                  @click="handleColumnAction(COLUMN_ACTIONS.CREATE_CARD, column.id)"
                >
                  Add card
                </v-btn>
              </div>
            </draggable>
          </container>
        </div>
      </v-window-item>
    </v-window>
  </v-container>
  <kanban-card-dialog />
  <project-dialog />
  <column-dialog />
</template>

<script setup lang="ts">
import ColumnDialog from "@/components/columnDialog/ColumnDialog.vue";
import KanbanCard from "@/components/kanban/KanbanCard.vue";
import KanbanCardDialog from "@/components/kanban/KanbanCardDialog.vue";
import ProjectDialog from "@/components/projectDialog/ProjectDialog.vue";
import { useConfirmationDialog } from "@/composables/useConfirmationDialog";
import { useNotifications } from "@/composables/useNotifications";
import { CARD_ACTIONS, COLUMN_ACTIONS } from "@/constants/kanban";
import { DropResult } from "@/models/common";
import { CardModel, ColumnModel, MovePosition } from "@/models/kanban";
import { useKanbanStore } from "@/store/kanban";
import { useDebounceFn } from "@vueuse/core";
import { onMounted, reactive, ref } from "vue";
import { Container, Draggable } from "vue3-smooth-dnd";

const kanbanStore = useKanbanStore();
const createConfirmationDialog = useConfirmationDialog();
const { alert } = useNotifications();

const columnActions = [
  {
    icon: "mdi-delete-outline",
    text: "Delete",
    type: COLUMN_ACTIONS.DELETE,
    color: "red"
  },
  {
    icon: "mdi-plus-box",
    text: "Create card",
    type: COLUMN_ACTIONS.CREATE_CARD,
    color: "blue"
  }
];

const cardActions = [
  {
    icon: "mdi-delete-outline",
    text: "Delete",
    type: CARD_ACTIONS.DELETE,
    color: "red"
  }
];

interface State {
  loading: boolean;
  dragging: boolean;
  draggingCard: boolean;
  draggingColumn: boolean;
}

const dropPlaceholderOptions = {
  className: "drop-preview",
  animationDuration: "150",
  showOnTop: true
};

const state: State = reactive({
  loading: false,
  dragging: false,
  draggingCard: false,
  draggingColumn: false
});

const handleColumnAction = async (action: string, columnId: number) => {
  switch (action) {
    case COLUMN_ACTIONS.DELETE:
      const answerDelete = await createConfirmationDialog();
      if (answerDelete) await kanbanStore.deleteColumn(columnId);
      break;
    case COLUMN_ACTIONS.CREATE_CARD:
      kanbanStore.kanbanCardDialog = true;
      kanbanStore.activeColumnId = columnId;
      break;
  }
};

const handleCardAction = async (action: string, cardId: number) => {
  switch (action) {
    case CARD_ACTIONS.DELETE:
      const answerDelete = await createConfirmationDialog();
      if (answerDelete) await kanbanStore.deleteCard(cardId);
      break;
  }
};

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

const onCardDrop = async <T extends CardModel>(
  projectId: number,
  columnId: number,
  dropResult: DropResult<T>
) => {
  if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
    if (dropResult.addedIndex === dropResult.removedIndex) return;
    const project = kanbanStore.projects.find((p) => p.id === projectId);
    if (project) {
      const column = project.columns.filter((p) => p.id === columnId)[0];
      const itemIndex = project.columns.indexOf(column);
      const newColumn = Object.assign({}, column);
      newColumn.cards = applyDrag<CardModel>(newColumn.cards, dropResult);
      project.columns.splice(itemIndex, 1, newColumn);
      if (dropResult.addedIndex !== null && dropResult.removedIndex !== null) {
        // Rearrange in the same column
        const columnPositions: MovePosition[] = newColumn.cards.map((c, i) => ({
          id: c.id,
          newPosition: i
        }));
        await kanbanStore.rearrangeCardsInColumn(columnPositions);
      } else if (dropResult.addedIndex !== null) {
        // Moved to new column
        const oldColumnPositions: MovePosition[] = [];
        const newColumnPositions: MovePosition[] = newColumn.cards.map((c, i) => ({
          id: c.id,
          newPosition: i
        }));

        const oldCardPosition = dropResult.payload.position;
        const oldColumn = project.columns.find((p) => p.id === dropResult.payload.columnId);

        if (oldColumn) {
          for (const card of oldColumn.cards.filter((c) => c.id !== dropResult.payload.id)) {
            oldColumnPositions.push({
              id: card.id,
              newPosition: oldCardPosition < card.position ? card.position - 1 : card.position
            });
          }

          await kanbanStore.moveCardToColumn({
            cardId: dropResult.payload.id,
            positions: [...oldColumnPositions, ...newColumnPositions],
            newColumnId: columnId
          });

          const card = newColumn.cards.find((c) => c.id === dropResult.payload.id);
          card!.columnId = columnId;
        }
      }
    }
  }
};

const getCardPayload = (projectId: number, columnId: number) => {
  return (index: number) => {
    const project = kanbanStore.projects.find((p) => p.id === projectId);
    return project?.columns.filter((p) => p.id === columnId)[0].cards[index];
  };
};

const getColumnPayload = (projectId: number) => {
  return (index: number) => {
    const project = kanbanStore.projects.find((p) => p.id === projectId);
    return project?.columns[index];
  };
};

const onColumnDrop = async (projectId: number, dropResult: DropResult<ColumnModel>) => {
  const project = kanbanStore.projects.find((p) => p.id === projectId);
  if (project) {
    project.columns = applyDrag(project.columns, dropResult);
    const positions: MovePosition[] = project.columns.map((c, i) => ({
      id: c.id,
      newPosition: i
    }));
    await kanbanStore.rearrangeColumns(positions);
  }
};

const deleteProject = async () => {
  const answer = await createConfirmationDialog();
  if (answer) {
    //
  }
};

const loadProjects = async () => {
  state.loading = true;
  await kanbanStore.loadProjects();
  state.loading = false;
};

const updateColumnName = useDebounceFn(async (columnId: number, value: string) => {
  if (value.length >= 3) {
    await kanbanStore.changeColumnName(columnId, value);
    alert({
      text: "Column name updated"
    });
  }
}, 400);

const onDragCardStart = () => {
  state.draggingCard = true;
};

const onDragCardEnd = () => {
  state.draggingCard = false;
};

const onDragColumnStart = () => {
  state.draggingColumn = true;
};

const onDragColumnEnd = () => {
  state.draggingColumn = false;
};

const tableEl = ref<any>(null);
const pos = {
  top: 0,
  y: 0
};

onMounted(async () => {
  await loadProjects();
  if (tableEl.value) {
    const table = tableEl.value.$el;
    const ele = table.childNodes[1]; // Select inner scrolling portion

    const mouseDownHandler = ({ clientY }: MouseEvent) => {
      ele.style.cursor = "grabbing";
      ele.style.userSelect = "none";
      pos.top = ele.scrollTop;
      pos.y = clientY;
      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    };

    const mouseMoveHandler = ({ clientY }: MouseEvent) => {
      const dy = clientY - pos.y;
      ele.scrollTop = pos.top - dy;
      state.dragging = true;
    };

    const mouseUpHandler = () => {
      ele.style.cursor = "pointer";
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
      setTimeout(() => {
        state.dragging = false;
      }, 100);
    };

    ele.addEventListener("mousedown", mouseDownHandler);
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

:deep(.v-list-item__content) {
  display: flex;
}

:deep(.v-field) {
  color: white !important;
}
</style>
