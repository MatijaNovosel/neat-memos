<template>
  <v-dialog
    :fullscreen="smAndDown"
    width="700"
    persistent
    :model-value="memoStore.editDialog"
  >
    <v-card>
      <v-card-title class="d-flex items-center align-center pt-4 px-6">
        <span> Edit memo </span>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          color="black"
          @click="close"
        />
      </v-card-title>
      <v-card-text class="pt-0">
        <memo-entry :initial-content="initialContent" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import MemoEntry from "@/components/memoEntry/MemoEntry.vue";
import { useMemoStore } from "@/store/memos";
import { ref, watch } from "vue";
import { useDisplay } from "vuetify";

const memoStore = useMemoStore();
const initialContent = ref<string | null | undefined>(null);
const { smAndDown } = useDisplay();

const close = () => {
  memoStore.closeEditDialog();
  memoStore.setActiveMemo(null);
};

watch(
  () => memoStore.editDialog,
  (val) => {
    if (val) {
      initialContent.value = memoStore.activeMemo?.content;
    }
  }
);
</script>
