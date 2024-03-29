<template>
  <v-card
    flat
    color="white"
  >
    <div
      class="d-flex justify-space-between align-center px-5 pt-3 text-subtitle-2 text-grey font-weight-regular"
    >
      <div class="d-flex align-center">
        <span> 4 minutes ago </span>
        <template v-if="props.pinned">
          <span class="ml-2 mr-1"> • </span>
          <v-icon color="amber"> mdi-bookmark </v-icon>
        </template>
      </div>
      <v-btn
        variant="text"
        density="compact"
        icon="mdi-dots-vertical"
        class="top-right"
        color="grey"
      />
    </div>
    <v-card-text class="pt-2">
      <markdown-renderer :source="props.content" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import MarkdownRenderer from "@/components/markdownRenderer/MarkdownRenderer.vue";
import MarkdownIt from "markdown-it";
import MarkdownItTasklists from "markdown-it-task-lists";
import { computed } from "vue";

interface Props {
  pinned?: boolean;
  content: string;
}

const props = withDefaults(defineProps<Props>(), {
  pinned: true
});

const markdown = new MarkdownIt().use(MarkdownItTasklists);
</script>
