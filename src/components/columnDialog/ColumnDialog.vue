<template>
  <v-dialog
    class="d-flex flex-column align-center"
    :fullscreen="smAndDown"
    width="450"
    persistent
    :model-value="kanbanStore.columnDialog"
  >
    <v-card>
      <v-card-title class="d-flex items-center align-center pt-3 px-6">
        <span> New column </span>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          :color="theme.current.value.dark ? 'white' : 'black'"
          @click="close"
        />
      </v-card-title>
      <v-divider />
      <vv-form
        ref="columnForm"
        as="v-form"
        @submit="saveColumn"
      >
        <v-card-text class="pt-3 align-content-end">
          <vv-field
            v-slot="{ field, errors }"
            v-model="name"
            name="projectName"
            rules="required|min:3"
            label="Project name"
          >
            <v-text-field
              v-model="name"
              v-bind="field"
              density="compact"
              placeholder="Project name"
              hide-details="auto"
              :error-messages="errors"
            />
          </vv-field>
        </v-card-text>
        <v-divider />
        <v-card-actions class="justify-end">
          <v-btn
            rounded="8"
            color="green"
            type="submit"
          >
            Save
          </v-btn>
        </v-card-actions>
      </vv-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useNotifications } from "@/composables/useNotifications";
import { IForm } from "@/models/common";
import { useKanbanStore } from "@/store/kanban";
import { ref } from "vue";
import { useDisplay, useTheme } from "vuetify";

const columnForm = ref<IForm | null>(null);
const name = ref("");

const theme = useTheme();
const kanbanStore = useKanbanStore();
const { smAndDown } = useDisplay();
const { alert } = useNotifications();

const resetProjectForm = () => {
  name.value = "";
  columnForm.value?.resetForm();
};

const close = () => {
  resetProjectForm();
  kanbanStore.columnDialog = false;
};

const saveColumn = async () => {
  if (
    !columnForm.value ||
    !(await columnForm.value.validate()).valid ||
    !kanbanStore.selectedProject
  ) {
    return;
  }
  const activeProject = kanbanStore.projects.find((p) => p.id === kanbanStore.selectedProject);
  if (activeProject) {
    const maxPosition = Math.max(...activeProject.columns.map((c) => c.position));
    await kanbanStore.createColumn(name.value, maxPosition + 1, kanbanStore.selectedProject);
  }
  alert({
    text: "Column created"
  });
  close();
};
</script>

<style scoped lang="scss">
:deep(.v-color-picker-preview__alpha) {
  display: none !important;
}
</style>
