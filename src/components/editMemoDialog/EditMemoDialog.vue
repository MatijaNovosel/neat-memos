<template>
  <v-dialog
    :fullscreen="smAndDown"
    width="700"
    persistent
    :model-value="memoStore.editDialog"
  >
    <v-card>
      <v-card-title class="d-flex items-center align-center pt-3 px-6">
        <span> Edit memo </span>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          :color="theme.current.value.dark ? 'white' : 'black'"
          @click="close"
        />
      </v-card-title>
      <v-divider />
      <v-card-text class="pt-4">
        <memo-entry
          :initial-tags="initialTags"
          :initial-content="initialContent"
          :initial-files="initialFiles"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import MemoEntry from "@/components/memoEntry/MemoEntry.vue";
import { MemoFile } from "@/models/memo";
import { TagModel } from "@/models/tag";
import { useMemoStore } from "@/store/memos";
import { ref, watch } from "vue";
import { useDisplay, useTheme } from "vuetify";

const memoStore = useMemoStore();
const initialContent = ref<string | null | undefined>(null);
const initialTags = ref<TagModel[]>([]);
const initialFiles = ref<MemoFile[]>([]);
const { smAndDown } = useDisplay();
const theme = useTheme();

const close = () => {
  memoStore.closeEditDialog();
  memoStore.setActiveMemo(null);
};

watch(
  () => memoStore.editDialog,
  (val) => {
    if (val) {
      initialContent.value = memoStore.activeMemo?.content;
      initialTags.value = memoStore.activeMemo?.tags || [];
      initialFiles.value = [...(memoStore.activeMemo?.files as MemoFile[])] || [];
    }
  }
);
</script>
