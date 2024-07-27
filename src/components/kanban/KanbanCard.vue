<template>
  <v-card
    class="pa-0 mb-3"
    flat
  >
    <v-card-title>
      <v-chip
        size="x-small"
        color="orange"
      >
        Kurcina
      </v-chip>
    </v-card-title>
    <v-card-text>
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
