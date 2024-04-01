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
          :color="theme.current.value.dark ? 'white' : 'black'"
          @click="close"
        />
      </v-card-title>
      <v-card-text class="pt-0 pb-5">
        <memo
          v-if="memoStore.previewMemo"
          readonly
          :data="memoStore.previewMemo"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import Memo from "@/components/memo/Memo.vue";
import { useMemoStore } from "@/store/memos";
import { useDisplay, useTheme } from "vuetify";

const memoStore = useMemoStore();
const { smAndDown } = useDisplay();
const theme = useTheme();

const close = () => {
  memoStore.closePreviewDialog();
  memoStore.setPreviewMemo(null);
};
</script>
