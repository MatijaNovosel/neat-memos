<template>
  <v-navigation-drawer
    location="right"
    :order="1"
    v-model="state.drawer"
    :permanent="mdAndUp"
    class="pa-5 right-drawer"
    :class="theme.current.value.dark ? '' : 'bg-grey-lighten-4'"
  >
    <template #prepend>
      <v-text-field
        :placeholder="i18n.t('searchMemos')"
        density="compact"
        hide-details
        prepend-inner-icon="mdi-magnify"
        clearable
        :bg-color="theme.current.value.dark ? '' : 'white'"
        v-model="memoStore.searchText"
      />
      <v-card
        class="mt-4"
        border
        flat
      >
        <v-card-title class="text-subtitle-1 font-weight-bold text-grey pb-1">
          {{ i18n.t("statistics") }}
        </v-card-title>
        <v-card-text class="px-0">
          <v-list-item density="compact">
            <v-icon
              color="grey"
              class="mr-2"
            >
              mdi-calendar
            </v-icon>
            {{ i18n.t("days") }}
            <template #append> {{ memoStore.dayCount }} </template>
          </v-list-item>
          <v-list-item density="compact">
            <v-icon
              color="grey"
              class="mr-2"
            >
              mdi-bookshelf
            </v-icon>
            {{ i18n.t("memos") }}
            <template #append> {{ memoStore.memoCount }} </template>
          </v-list-item>
          <v-list-item density="compact">
            <v-icon
              color="grey"
              class="mr-2"
            >
              mdi-tag-outline
            </v-icon>
            {{ i18n.t("tags") }}
            <template #append> {{ memoStore.tagCount }} </template>
          </v-list-item>
        </v-card-text>
      </v-card>
      <div class="d-flex items-center align-center my-3 ml-2">
        <span class="text-subtitle-1 text-grey"> {{ i18n.t("tags") }} </span>
        <v-btn
          class="ml-2"
          variant="text"
          icon="mdi-plus-box"
          density="compact"
          color="grey"
          @click="memoStore.openTagDialog"
        />
      </div>
    </template>
    <div class="ml-2 flex-grow-1">
      <div
        class="d-flex flex-column flex-gap"
        v-if="memoStore.tags.length"
      >
        <v-chip
          @click="addToFilter(tag)"
          :color="isInTagFilter(tag) ? tag.color : 'grey'"
          v-for="tag in memoStore.tags"
          :key="tag.id"
        >
          <v-icon
            class="mr-2"
            size="18"
            :color="isInTagFilter(tag) ? tag.color : 'grey'"
          >
            {{ isInTagFilter(tag) ? "mdi-pound-box" : "mdi-pound-box-outline" }}
          </v-icon>
          <span> {{ tag.content }} </span>
        </v-chip>
      </div>
      <div
        class="text-grey text-caption mt-1"
        v-else
      >
        {{ i18n.t("noTagsFound") }} 🙀
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { TagModel } from "@/models/tag";
import { useAppStore } from "@/store/app";
import { useMemoStore } from "@/store/memos";
import { reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useDisplay, useTheme } from "vuetify";

const { mdAndUp } = useDisplay();
const appStore = useAppStore();
const memoStore = useMemoStore();
const theme = useTheme();
const i18n = useI18n();

const state = reactive({
  drawer: mdAndUp.value ? true : false
});

const addToFilter = (tag: TagModel) => {
  memoStore.addToTagFilter(tag);
};

const isInTagFilter = (tag: TagModel) => {
  return !!memoStore.filterTags.find((t) => t.id === tag.id);
};

watch(
  () => appStore.rightDrawer,
  () => (state.drawer = !state.drawer)
);
</script>

<style scoped lang="scss">
.right-drawer {
  border: 0;
}

:deep(.v-navigation-drawer__content) {
  display: flex;
  flex-direction: column;
}
</style>
