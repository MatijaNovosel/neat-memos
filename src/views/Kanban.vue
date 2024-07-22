<template>
  <v-container class="main-ctr">
    <mobile-drawer-controls hide-right />
    <v-card
      class="pa-5"
      flat
      border
    >
      Kanban
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { reactive } from "vue";

interface Card {
  id: number;
  name: string;
}

interface Column {
  id: number;
  name: string;
  cards: Card[];
}

interface Project {
  id: number;
  name: string;
  columns: Column[];
}

interface State {
  projects: Project[];
}

const state: State = reactive({
  projects: []
});
</script>
