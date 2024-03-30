<template>
  <v-container class="main-ctr">
    <mobile-drawer-controls />
    <memo-entry />
    <v-row
      v-if="memoStore.filterActive"
      class="ml-1 my-3 d-flex align-center"
    >
      <v-icon color="grey"> mdi-filter-outline </v-icon>
      <span class="text-subtitle-2 ml-1 text-grey"> Filter: </span>
      <v-chip
        v-if="memoStore.searchText"
        color="orange"
        class="ml-2"
        label
        closable
        @click:close="memoStore.removeFilter(MEMO_FILTERS.SEARCH_TEXT)"
      >
        <v-icon
          icon="mdi-magnify"
          start
        />
        {{ memoStore.searchText }}
      </v-chip>
      <v-chip
        v-for="tag in memoStore.filterTags"
        :key="tag.id"
        :color="tag.color"
        class="ml-2"
        label
        closable
        @click:close="memoStore.removeFilter(MEMO_FILTERS.TAG, tag.id)"
      >
        <v-icon
          icon="mdi-tag-outline"
          :color="tag.color"
          start
        />
        {{ tag.content }}
      </v-chip>
    </v-row>
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
import Memo from "@/components/memo/Memo.vue";
import MemoEntry from "@/components/memoEntry/MemoEntry.vue";
import MobileDrawerControls from "@/components/mobileDrawerControls/MobileDrawerControls.vue";
import { useMemoStore } from "@/store/memos";
import { onMounted, reactive } from "vue";
import { MEMO_FILTERS } from "@/constants/memo";

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
