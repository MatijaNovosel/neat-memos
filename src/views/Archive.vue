<template>
  <v-container class="main-ctr">
    <mobile-drawer-controls />
    <v-expand-transition>
      <active-filters v-if="memoStore.filterActive" />
    </v-expand-transition>
    <v-row
      v-if="memoStore.filteredMemosArchived.length"
      class="py-6"
    >
      <v-col
        class="py-1"
        cols="12"
        v-for="memo in memoStore.filteredMemosArchived"
        :key="memo.id"
      >
        <memo :data="memo" />
      </v-col>
    </v-row>
    <div
      class="d-flex flex-column align-center mt-10"
      v-else
    >
      <span class="text-h1 mb-5"> 😿 </span>
      <span class="text-h6"> {{ i18n.t("noDataFound") }}. </span>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import ActiveFilters from "@/components/activeFilters/ActiveFilters.vue";
import Memo from "@/components/memo/Memo.vue";
import MobileDrawerControls from "@/components/mobileDrawerControls/MobileDrawerControls.vue";
import { useMemoStore } from "@/store/memos";
import { useI18n } from "vue-i18n";

const memoStore = useMemoStore();
const i18n = useI18n();
</script>
