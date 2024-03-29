<template>
  <v-container class="main-ctr py-6">
    <memo-entry />
    <v-row v-if="memos.length">
      <v-col
        cols="12"
        v-for="memo in memos"
        :key="memo.id"
      >
        <memo />
      </v-col>
    </v-row>
    <div
      class="d-flex flex-column align-center mt-10"
      v-else
    >
      <span class="text-h1 mb-5"> 😿 </span>
      <span class="text-h6"> No data found. </span>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import Memo from "@/components/memo/Memo.vue";
import MemoEntry from "@/components/memoEntry/MemoEntry.vue";
import { useMemoStore } from "@/store/memos";
import { storeToRefs } from "pinia";
import { onMounted, reactive } from "vue";

interface State {
  loading: boolean;
}

const memoStore = useMemoStore();
const { memos } = storeToRefs(memoStore);

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
  max-width: 80%;
  height: 100vh;
}
</style>
