<template>
  <v-container class="main-ctr">
    <mobile-drawer-controls />
    <memo-entry />
    <v-expand-transition>
      <active-filters v-if="memoStore.filterActive" />
    </v-expand-transition>
    <v-row v-if="loading">
      <v-progress-circular
        class="my-6 mx-auto"
        color="orange"
        size="50"
        indeterminate
      />
    </v-row>
    <div
      class="d-flex flex-column align-center mt-10"
      v-if="!memoStore.filteredMemosNormal.length && !loading"
    >
      <span class="text-h1 mb-5"> 😿 </span>
      <span class="text-h6"> {{ i18n.t("noDataFound") }}. </span>
    </div>
    <v-row
      v-if="!loading && memoStore.filteredMemosNormal.length"
      class="pb-6"
    >
      <v-col
        class="py-1"
        cols="12"
        v-for="memo in memoStore.filteredMemosNormal"
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
import { useMemoStore } from "@/store/memos";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const memoStore = useMemoStore();
const i18n = useI18n();

const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  await memoStore.loadMemos();
  await memoStore.loadTags();
  loading.value = false;
});
</script>
