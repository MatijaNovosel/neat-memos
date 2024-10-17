<template>
  <div
    :id="`project-${props.project.id}`"
    class="pt-5 px-5 pb-4 d-flex kanban-projects rounded-lg h-100 can-drag"
    :class="{
      'bg-grey-lighten-3': !appStore.darkMode,
      'bg-grey-darken-4': appStore.darkMode
    }"
  >
    <container
      lock-axis="x"
      :should-accept-drop="() => kanbanStore.interactionsDisabled"
      tag="div"
      class="d-flex flex-gap h-fit-content can-drag"
      group-name="cols"
      orientation="horizontal"
      :get-child-payload="getColumnPayload(project.id)"
      @drop="(e: DropResult<ColumnModel>) => onColumnDrop(project.id, e)"
    >
      <template v-if="project.columns.length">
        <draggable
          v-for="column in project.columns"
          :key="column.id"
          class="column-ctr"
        >
          <kanban-column :column="column" />
        </draggable>
      </template>
      <div
        v-else
        class="text-grey text-center"
      >
        No columns found
      </div>
    </container>
  </div>
</template>

<script lang="ts" setup>
import { applyDrag } from "@/helpers/kanban";
import { DropResult } from "@/models/common";
import { ColumnModel, MovePosition, ProjectModel } from "@/models/kanban";
import { useAppStore } from "@/store/app";
import { useKanbanStore } from "@/store/kanban";
import { onMounted } from "vue";
import { Container, Draggable } from "vue3-smooth-dnd";
import KanbanColumn from "./KanbanColumn.vue";

const pos = {
  x: 0,
  left: 0
};

const kanbanStore = useKanbanStore();
const appStore = useAppStore();

const props = defineProps<{
  project: ProjectModel;
}>();

const getColumnPayload = (projectId: number) => {
  return (index: number) => {
    const project = kanbanStore.projects.find((p) => p.id === projectId);
    return project?.columns[index];
  };
};

const onColumnDrop = async (projectId: number, dropResult: DropResult<ColumnModel>) => {
  const project = kanbanStore.projects.find((p) => p.id === projectId);
  if (project && dropResult.addedIndex !== dropResult.removedIndex) {
    project.columns = applyDrag(project.columns, dropResult);
    const positions: MovePosition[] = project.columns.map((c, i) => ({
      id: c.id,
      newPosition: i
    }));
    await kanbanStore.rearrangeColumns(positions);
    for (const position of positions) {
      const column = project.columns.find((c) => c.id === position.id);
      if (column) {
        column.position = position.newPosition;
      }
    }
  }
};

const injectDragging = (ele: HTMLElement) => {
  const mouseDownHandler = ({ clientX, target }: MouseEvent) => {
    const classList = [...(target as HTMLElement).classList];
    if (classList.includes("can-drag")) {
      ele.style.cursor = "grabbing";
      ele.style.userSelect = "none";
      pos.left = ele.scrollLeft;
      pos.x = clientX;
      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    }
  };

  const mouseMoveHandler = ({ clientX }: MouseEvent) => {
    const dx = clientX - pos.x;
    ele.scrollLeft = pos.left - dx;
  };

  const mouseUpHandler = () => {
    ele.style.cursor = "auto";
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
  };

  ele.addEventListener("mousedown", mouseDownHandler);
};

onMounted(() => {
  const element = document.getElementById(`project-${props.project.id}`);
  if (element) {
    injectDragging(element);
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
</style>
