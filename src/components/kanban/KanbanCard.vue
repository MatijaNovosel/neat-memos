<template>
  <v-card
    class="pa-0 mb-3"
    flat
  >
    <v-card-title class="d-flex labels">
      <v-chip
        size="x-small"
        color="orange"
      >
        Todo
      </v-chip>
      <v-chip
        size="x-small"
        color="red"
      >
        Media
      </v-chip>
      <v-chip
        size="x-small"
        color="blue"
      >
        Movies
      </v-chip>
    </v-card-title>
    <v-card-text class="mt-1">
      {{ props.data.name }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { Card } from "@/models/kanban";

const props = defineProps<{
  data: Card;
}>();
</script>

<style scoped>
.labels {
  gap: 8px;
  flex-wrap: wrap;
}
</style>
