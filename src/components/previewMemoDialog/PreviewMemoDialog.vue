<template>
  <v-dialog
    :fullscreen="smAndDown"
    width="700"
    persistent
    :model-value="memoStore.previewDialog"
  >
    <v-card>
      <v-card-title class="d-flex items-center align-center pt-4 px-6">
        <span> Preview memo </span>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          color="black"
          @click="close"
        />
      </v-card-title>
      <v-card-text class="pt-0 pb-5">
        <memo
          v-if="memoStore.activeMemo"
          readonly
          :data="memoStore.activeMemo"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import Memo from "@/components/memo/Memo.vue";
import { useMemoStore } from "@/store/memos";
import { useDisplay } from "vuetify";

const memoStore = useMemoStore();
const { smAndDown } = useDisplay();

const close = () => {
  memoStore.closePreviewDialog();
  memoStore.setActiveMemo(null);
};
</script>
