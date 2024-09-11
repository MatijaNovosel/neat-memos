<template>
  <v-container class="main-ctr">
    <mobile-drawer-controls
      :hide-left="!userStore.isAuthenticated"
      hide-right
    />
    <v-row v-if="loading">
      <v-progress-circular
        class="my-6 mx-auto"
        color="orange"
        size="50"
        indeterminate
      />
    </v-row>
    <memo
      v-if="memo && !loading"
      :data="memo"
      readonly
    />
    <v-row
      class="mt-10 d-flex flex-column align-center"
      v-if="!memo && !loading"
    >
      <span class="text-h1 mb-5"> 😿 </span>
      <span class="text-h6"> {{ i18n.t("noDataFound") }}. </span>
    </v-row>
    <v-row class="justify-center mt-8">
      <v-btn
        variant="flat"
        rounded="12"
        :to="{
          name: ROUTE_NAMES.HOME
        }"
        color="orange-darken-1"
      >
        Home
      </v-btn>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { MemoService } from "@/api/services/memos";
import Memo from "@/components/memo/Memo.vue";
import { MemoModel } from "@/models/memo";
import ROUTE_NAMES from "@/router/routeNames";
import { useUserStore } from "@/store/user";
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const route = useRoute();
const i18n = useI18n();
const userStore = useUserStore();
const memoService = new MemoService();

const memo = ref<MemoModel | null>(null);
const loading = ref(false);

const getMemo = async () => {
  loading.value = true;
  const fetchedMemo = await memoService.getMemo(parseInt(route.params.id as string));
  memo.value = fetchedMemo;
  loading.value = false;
};

watch(
  () => route.params,
  () => {
    getMemo();
  },
  {
    deep: true
  }
);

onMounted(getMemo);
</script>
