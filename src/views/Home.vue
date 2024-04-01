<template>
  <v-container class="main-ctr">
    <mobile-drawer-controls />
    <memo-entry />
    <v-expand-transition>
      <active-filters v-if="memoStore.filterActive" />
    </v-expand-transition>
    <v-row v-if="state.loading">
      <v-progress-circular
        class="my-6 mx-auto"
        color="orange"
        size="50"
        indeterminate
      />
    </v-row>
    <div
      class="d-flex flex-column align-center mt-10"
      v-if="!memoStore.filteredMemos.length && !state.loading"
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
        v-for="memo in memoStore.filteredMemos"
        :key="memo.id"
      >
        <memo :data="memo" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import ActiveFilters from "@/components/activeFilters/ActiveFilters.vue";
import Memo from "@/components/memo/Memo.vue";
import MemoEntry from "@/components/memoEntry/MemoEntry.vue";
import MobileDrawerControls from "@/components/mobileDrawerControls/MobileDrawerControls.vue";
import { useMemoStore } from "@/store/memos";
import { onMounted, reactive } from "vue";

interface State {
  loading: boolean;
}

const memoStore = useMemoStore();

const state: State = reactive({
  loading: false
});

onMounted(async () => {
  state.loading = true;
  await memoStore.loadMemos();
  await memoStore.loadTags();
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
