<template>
  <v-container class="main-ctr">
    <v-text-field
      readonly
      hide-details
      label="Date"
      :model-value="dateFormatted"
      :bg-color="theme.current.value.dark ? '' : 'white'"
    >
      <v-menu activator="parent">
        <v-date-picker v-model="state.selectedDate" />
      </v-menu>
    </v-text-field>
    <v-row v-if="state.loading">
      <v-progress-circular
        class="my-6 mx-auto"
        color="orange"
        size="50"
        indeterminate
      />
    </v-row>
    <v-row
      class="mt-10 d-flex flex-column align-center"
      v-if="!memos.length && !state.loading"
    >
      <span class="text-h1 mb-5"> 😿 </span>
      <span class="text-h6 mb-4"> {{ i18n.t("noDataFound") }}. </span>
    </v-row>
    <v-row
      v-if="!state.loading && memos.length"
      class="pt-6"
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
import { useMemoStore } from "@/store/memos";
import { format } from "date-fns";
import { computed, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useTheme } from "vuetify";

interface State {
  selectedDate: Date;
  loading: boolean;
}

const memoStore = useMemoStore();
const i18n = useI18n();
const theme = useTheme();

const state: State = reactive({
  selectedDate: new Date(),
  loading: false
});

const dateFormatted = computed(() => {
  return format(state.selectedDate, "dd.MM.yyyy.");
});

const memos = computed(() => {
  const date = state.selectedDate;
  date.setHours(0, 0, 0, 0);
  return memoStore.memos.filter((m) => {
    const d = new Date(m.createdAt);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === date.getTime();
  });
});
</script>
