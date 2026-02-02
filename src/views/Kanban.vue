<template>
  <v-container>
    <mobile-drawer-controls hide-right />
    <div class="d-flex justify-space-between align-center flex-wrap">
      <template v-if="kanbanStore.filteredProjects.length">
        <v-tabs
          v-model="kanbanStore.selectedProject"
          align-tabs="center"
          color="orange"
        >
          <v-tab
            v-for="project in kanbanStore.filteredProjects"
            :key="project.id"
            rounded="0"
            :value="project.id"
            class="text-transform-inh"
          >
            <span class="mr-2">
              {{ project.name }}
            </span>
            <v-btn
              v-if="kanbanStore.isOwner"
              icon="mdi-close-circle"
              density="compact"
              color="grey"
              variant="text"
              size="small"
              :disabled="kanbanStore.interactionsDisabled"
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
      <div class="d-flex flex-gap align-center flex-wrap mt-5 mt-md-0">
        <v-text-field
          density="compact"
          placeholder="Search"
          hide-details
          clearable
          class="search-input"
          v-model="kanbanStore.searchText"
          :disabled="kanbanStore.loading"
        />
        <v-btn
          v-if="userStore.isAuthenticated"
          :loading="kanbanStore.loading"
          :disabled="kanbanStore.interactionsDisabled"
          color="green"
          icon
          rounded="0"
          variant="tonal"
          size="small"
          @click="kanbanStore.projectDialog = true"
        >
          <v-icon> mdi-plus </v-icon>
          <v-tooltip
            activator="parent"
            location="end"
          >
            Add project
          </v-tooltip>
        </v-btn>
        <v-btn
          :loading="kanbanStore.loading"
          :disabled="kanbanStore.interactionsDisabled"
          color="blue"
          icon
          rounded="0"
          variant="tonal"
          size="small"
          @click="kanbanStore.columnDialog = true"
        >
          <v-icon> mdi-table-column-plus-before </v-icon>
          <v-tooltip
            activator="parent"
            location="end"
          >
            Add column
          </v-tooltip>
        </v-btn>
        <v-checkbox
          v-model="publicProject"
          label="Public"
          class="mr-3"
          hide-details
          color="orange"
          :disabled="isPublicProjectCheckboxDisabled"
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
        v-for="project in kanbanStore.filteredProjects"
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
import { useMemoStore } from "@/store/memos";
import { useUserStore } from "@/store/user";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const kanbanStore = useKanbanStore();
const userStore = useUserStore();
const memoStore = useMemoStore();
const route = useRoute();
const createConfirmationDialog = useConfirmationDialog();

const publicProject = ref(false);
const loading = ref(false);

const deleteProject = async (projectId: number) => {
  if (kanbanStore.interactionsDisabled) return;
  const answer = await createConfirmationDialog();
  if (answer) {
    await kanbanStore.deleteProject(projectId);
  }
};

const isPublicProjectCheckboxDisabled = computed(() => {
  return (
    kanbanStore.interactionsDisabled ||
    kanbanStore.selectedProject === null ||
    !userStore.isAuthenticated ||
    !kanbanStore.isOwner
  );
});

/*
const cards = supabase
  .channel("custom-all-channel")
  .on("postgres_changes", { event: "*", schema: "public", table: "cards" }, async (payload) => {
    console.log(payload);
    switch (payload.eventType) {
      case "INSERT": {
        if (payload.new.client_id === realtimeClientId) {
          return;
        }

        const data = { ...payload.new, tags: [] as TagModel[] };
        await kanbanStore.addCardRealtime(data as CardModel);

        break;
      }
      case "UPDATE": {
        if (payload.new.client_id === realtimeClientId) {
          return;
        }

        const data = { ...payload.new, tags: [] as TagModel[] };
        await kanbanStore.updateCardRealtime(data as CardModel);

        break;
      }
      case "DELETE": {
        await kanbanStore.deleteCardRealtime(payload.old.id);
        break;
      }
    }
  })
  .subscribe();
*/

watch(
  () => kanbanStore.selectedProject,
  async (newValue) => {
    const project = kanbanStore.projects.find((p) => p.id === newValue);
    if (project) {
      publicProject.value = project.public;
    }
  },
  {
    deep: true
  }
);

watch(
  publicProject,
  async (newValue) => {
    kanbanStore.setProjectPublicStatus(kanbanStore.selectedProject!, newValue);
  },
  {
    deep: true
  }
);

onUnmounted(() => {
  // supabase.removeChannel(cards);
});

onMounted(async () => {
  loading.value = true;
  const userId = route.params.id as string;
  if (userId) {
    await memoStore.loadTags(userId);
    await kanbanStore.loadProjects(userId);
  }
  loading.value = false;
});
</script>

<style scoped>
.project-window {
  height: calc(100vh - 110px);
  overflow: auto;
}

.search-input {
  width: 200px;
}
</style>
