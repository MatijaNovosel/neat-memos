<template>
  <div
    v-if="smAndDown"
    class="d-flex align-center mb-4"
  >
    <v-btn
      v-show="!props.hideLeft"
      icon="mdi-menu"
      variant="text"
      color="grey"
      density="comfortable"
      class="mr-2"
      @click="appStore.triggerLeftDrawer"
    />
    <span class="text-subtitle-1 font-weight-bold"> Neat memos </span>
    <v-spacer />
    <v-btn
      v-show="!props.hideRight"
      icon="mdi-magnify"
      variant="text"
      color="grey"
      density="comfortable"
      @click="appStore.triggerRightDrawer"
    />
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/app";
import { useDisplay } from "vuetify";

interface Props {
  hideRight?: boolean;
  hideLeft?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  hideRight: false,
  hideLeft: false
});

const appStore = useAppStore();
const { smAndDown } = useDisplay();
</script>
