<template>
  <v-dialog
    class="d-flex flex-column align-center"
    :fullscreen="smAndDown"
    width="450"
    persistent
    :model-value="kanbanStore.projectDialog"
  >
    <v-card>
      <v-card-title class="d-flex items-center align-center pt-3 px-6">
        <span> New project </span>
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
        ref="projectForm"
        as="v-form"
        @submit="createProject"
      >
        <v-card-text class="pt-3 align-content-end">
          <vv-field
            v-slot="{ field, errors }"
            v-model="projectName"
            name="projectName"
            rules="required|min:3"
            label="Project name"
          >
            <v-text-field
              v-model="projectName"
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

const projectForm = ref<IForm | null>(null);

const theme = useTheme();
const kanbanStore = useKanbanStore();
const { smAndDown } = useDisplay();
const { alert } = useNotifications();
const projectName = ref("");

const resetProjectForm = () => {
  projectName.value = "";
  if (projectForm.value) {
    projectForm.value?.resetForm();
  }
};

const close = () => {
  resetProjectForm();
  kanbanStore.projectDialog = false;
};

const createProject = async () => {
  if (!projectForm.value || !(await projectForm.value.validate()).valid) {
    return;
  }
  await kanbanStore.createProject(projectName.value);
  alert({
    text: "Project created"
  });
  close();
};
</script>

<style scoped lang="scss">
:deep(.v-color-picker-preview__alpha) {
  display: none !important;
}
</style>
