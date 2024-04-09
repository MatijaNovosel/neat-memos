<template>
  <v-container class="main-ctr">
    <mobile-drawer-controls
      :hide-left="!userStore.isAuthenticated"
      hide-right
    />
    <v-row v-if="state.loading">
      <v-progress-circular
        class="my-6 mx-auto"
        color="orange"
        size="50"
        indeterminate
      />
    </v-row>
    <memo
      v-if="state.memo && !state.loading"
      :data="state.memo"
      readonly
    />
    <v-row
      class="mt-10 d-flex flex-column align-center"
      v-if="!state.memo && !state.loading"
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
import MobileDrawerControls from "@/components/mobileDrawerControls/MobileDrawerControls.vue";
import { MemoModel } from "@/models/memo";
import ROUTE_NAMES from "@/router/routeNames";
import { useUserStore } from "@/store/user";
import { onMounted, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

interface State {
  memo: MemoModel | null;
  loading: boolean;
}

const state: State = reactive({
  memo: null,
  loading: false
});

const route = useRoute();
const i18n = useI18n();
const userStore = useUserStore();
const memoService = new MemoService();

const getMemo = async () => {
  state.loading = true;
  const memo = await memoService.getMemo(parseInt(route.params.id as string));
  state.memo = memo;
  state.loading = false;
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
