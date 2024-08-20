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
              @click="deleteProject(project.id)"
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
    <v-row v-if="loading">
      <v-progress-circular
        class="my-6 mx-auto"
        color="orange"
        size="50"
        indeterminate
      />
    </v-row>
    <v-window
      v-if="!loading"
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
        <kanban-project :project="project" />
      </v-window-item>
    </v-window>
  </v-container>
  <kanban-card-dialog />
  <project-dialog />
  <column-dialog />
</template>

<script setup lang="ts">
import ColumnDialog from "@/components/columnDialog/ColumnDialog.vue";
import KanbanCardDialog from "@/components/kanban/KanbanCardDialog.vue";
import KanbanProject from "@/components/kanban/KanbanProject.vue";
import ProjectDialog from "@/components/projectDialog/ProjectDialog.vue";
import { useConfirmationDialog } from "@/composables/useConfirmationDialog";
import { useKanbanStore } from "@/store/kanban";
import { onMounted, ref } from "vue";

const kanbanStore = useKanbanStore();
const createConfirmationDialog = useConfirmationDialog();

const loading = ref(false);

const deleteProject = async (projectId: number) => {
  const answer = await createConfirmationDialog();
  if (answer) {
    await kanbanStore.deleteProject(projectId);
  }
};

onMounted(async () => {
  loading.value = true;
  await kanbanStore.loadProjects();
  loading.value = false;
});
</script>

<style scoped>
.project-window {
  height: calc(100vh - 110px);
  overflow: auto;
}
</style>
