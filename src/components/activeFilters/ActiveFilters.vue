<template>
  <v-row class="ml-1 my-3 d-flex align-center">
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
</template>

<script setup lang="ts">
import { MEMO_FILTERS } from "@/constants/memo";
import { useMemoStore } from "@/store/memos";

const memoStore = useMemoStore();
</script>
