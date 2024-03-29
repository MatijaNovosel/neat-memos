<template>
  <v-container class="main-ctr">
    <div
      v-if="smAndDown"
      class="d-flex align-center mb-4"
    >
      <v-btn
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
        icon="mdi-magnify"
        variant="text"
        color="grey"
        density="comfortable"
        @click="appStore.triggerRightDrawer"
      />
    </div>
    <memo-entry />
    <v-row v-if="state.loading">
      <v-progress-circular
        class="mt-6 mx-auto"
        color="orange"
        size="50"
        indeterminate
      />
    </v-row>
    <div
      class="d-flex flex-column align-center mt-10"
      v-if="!memos.length && !state.loading"
    >
      <span class="text-h1 mb-5"> 😿 </span>
      <span class="text-h6"> No data found. </span>
    </div>
    <v-row
      v-else
      class="pb-6"
    >
      <v-col
        class="py-1"
        cols="12"
        v-for="memo in memos"
        :key="memo.id"
      >
        <memo :data="memo" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import Memo from "@/components/memo/Memo.vue";
import MemoEntry from "@/components/memoEntry/MemoEntry.vue";
import { useAppStore } from "@/store/app";
import { useMemoStore } from "@/store/memos";
import { storeToRefs } from "pinia";
import { onMounted, reactive } from "vue";
import { useDisplay } from "vuetify";

interface State {
  loading: boolean;
}

const memoStore = useMemoStore();
const appStore = useAppStore();
const { memos } = storeToRefs(memoStore);
const { smAndDown } = useDisplay();

const state: State = reactive({
  loading: false
});

onMounted(async () => {
  state.loading = true;
  await memoStore.loadMemos();
  state.loading = false;
});
</script>

<style scoped lang="scss">
.main-ctr {
  max-width: 60%;
  height: 100vh;
}

@media only screen and (max-width: 600px) {
  .main-ctr {
    max-width: 100%;
  }
}
</style>
