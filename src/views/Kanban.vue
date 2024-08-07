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
          color="green"
          icon="mdi-plus"
          rounded="0"
          variant="tonal"
          size="small"
          @click="kanbanStore.projectDialog = true"
        />
        <v-btn
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
        :key="`tabItem_${project.id}`"
        :value="project.id"
        class="h-100"
      >
        <div
          :id="`project-${project.id}`"
          class="bg-grey-lighten-3 pt-5 px-5 pb-4 d-flex kanban-projects rounded-lg h-100"
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
                            class="text-caption py-0"
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
  <project-dialog />
  <column-dialog />
</template>

<script setup lang="ts">
import ColumnDialog from "@/components/columnDialog/ColumnDialog.vue";
import DetailsDialog from "@/components/kanban/DetailsDialog.vue";
import KanbanCard from "@/components/kanban/KanbanCard.vue";
import ProjectDialog from "@/components/projectDialog/ProjectDialog.vue";
import { useConfirmationDialog } from "@/composables/useConfirmationDialog";
import { COLUMN_ACTIONS } from "@/constants/kanban";
import { DropResult } from "@/models/common";
import { CardModel, ColumnModel } from "@/models/kanban";
import { useKanbanStore } from "@/store/kanban";
import { onMounted, reactive } from "vue";
import { Container, Draggable } from "vue3-smooth-dnd";

const kanbanStore = useKanbanStore();
const createConfirmationDialog = useConfirmationDialog();

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

interface State {
  loading: boolean;
}

const dropPlaceholderOptions = {
  className: "drop-preview",
  animationDuration: "150",
  showOnTop: true
};

const state: State = reactive({
  loading: false
});

const handleColumnAction = async (action: string, columnId: number) => {
  switch (action) {
    case COLUMN_ACTIONS.DELETE:
      const answerDelete = await createConfirmationDialog();
      if (answerDelete) await kanbanStore.deleteColumn(columnId);
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

const onDrop = <T extends CardModel>(
  projectId: number,
  columnId: number,
  dropResult: DropResult<T>
) => {
  if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
    const project = kanbanStore.projects.find((p) => p.id === projectId);
    if (project) {
      const column = project.columns.filter((p) => p.id === columnId)[0];
      const itemIndex = project.columns.indexOf(column);
      const newColumn = Object.assign({}, column);
      newColumn.cards = applyDrag<CardModel>(newColumn.cards, dropResult);
      project.columns.splice(itemIndex, 1, newColumn);
    }
  }
};

const getCardPayload = (projectId: number, columnId: number) => {
  return (index: number) => {
    const project = kanbanStore.projects.find((p) => p.id === projectId);
    return project?.columns.filter((p) => p.id === columnId)[0].cards[index];
  };
};

const onColumnDrop = (projectId: number, dropResult: DropResult<ColumnModel>) => {
  const project = kanbanStore.projects.find((p) => p.id === projectId);
  if (project) {
    project.columns = applyDrag(project.columns, dropResult);
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

onMounted(async () => {
  await loadProjects();
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
