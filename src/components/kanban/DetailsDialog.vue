<template>
  <v-dialog
    class="d-flex flex-column align-center"
    :fullscreen="smAndDown"
    width="450"
    persistent
    :model-value="kanbanStore.detailsDialog"
  >
    <v-card v-if="kanbanStore.activeCard">
      <v-card-title class="d-flex items-center align-center pt-2 px-6">
        <span> Details </span>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="close"
        />
      </v-card-title>
      <v-divider />
      <v-card-text class="pb-5">
        {{ kanbanStore.activeCard.name }}
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { useKanbanStore } from "@/store/kanban";
import { useDisplay } from "vuetify";

const { smAndDown } = useDisplay();

const kanbanStore = useKanbanStore();

const close = () => {
  kanbanStore.detailsDialog = false;
};
</script>
