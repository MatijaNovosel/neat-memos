<template>
  <v-container class="main-ctr">
    <mobile-drawer-controls hide-right />
    <v-text-field
      readonly
      hide-details
      label="Date"
      :model-value="dateFormatted"
      :bg-color="theme.current.value.dark ? '' : 'white'"
    >
      <v-dialog
        width="fit-content"
        v-if="smAndDown"
        activator="parent"
      >
        <div class="bg-white d-flex flex-column rounded-lg">
          <m-date-picker
            color="orange"
            class="pb-0 mx-auto"
            :events="memoStore.memoDates"
            v-model="selectedDate"
          />
          <v-btn
            size="small"
            rounded="12"
            color="orange-darken-1"
            class="w-fit-content mx-auto mb-3 mt-1"
            @click="setToday"
          >
            Today
          </v-btn>
        </div>
      </v-dialog>
      <v-menu
        v-else
        :close-on-content-click="false"
        activator="parent"
      >
        <div class="bg-white border d-flex flex-column w-fit-content">
          <m-date-picker
            color="orange"
            class="pb-0"
            :events="memoStore.memoDates"
            v-model="selectedDate"
          />
          <v-btn
            size="small"
            rounded="12"
            color="orange-darken-1"
            class="w-fit-content mx-auto mb-3 mt-1"
            @click="setToday"
          >
            Today
          </v-btn>
        </div>
      </v-menu>
    </v-text-field>
    <v-row
      class="mt-10 d-flex flex-column align-center"
      v-if="!memos.length"
    >
      <span class="text-h1 mb-5"> 😿 </span>
      <span class="text-h6 mb-4"> {{ i18n.t("noDataFound") }}. </span>
    </v-row>
    <v-row
      v-else
      class="pt-6"
    >
      <v-col
        class="py-1"
        cols="12"
        v-for="memo in memos"
        :key="memo.id"
      >
        <memo
          readonly
          :data="memo"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import Memo from "@/components/memo/Memo.vue";
import { useMemoStore } from "@/store/memos";
import { format } from "date-fns";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useDisplay, useTheme } from "vuetify";

const memoStore = useMemoStore();
const i18n = useI18n();
const theme = useTheme();
const { smAndDown } = useDisplay();

const selectedDate = ref(new Date().toISOString().substring(0, 10));

const dateFormatted = computed(() => format(selectedDate.value, "dd.MM.yyyy."));

const setToday = () => {
  selectedDate.value = new Date().toISOString().substring(0, 10);
};

const memos = computed(() => {
  const date = new Date(selectedDate.value);
  date.setHours(0, 0, 0, 0);
  return memoStore.memos.filter((m) => {
    const d = new Date(m.createdAt);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === date.getTime();
  });
});
</script>

<style scoped lang="scss">
@media only screen and (min-width: 600px) {
  :deep(.v-overlay__content) {
    width: 0px !important;
    min-width: 0px !important;
  }
}
</style>
