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
        class="bg-white"
        placeholder="Search memos"
        density="compact"
        hide-details
        variant="filled"
        prepend-inner-icon="mdi-magnify"
        clearable
        color="grey"
        v-model="memoStore.searchText"
      />
    </template>
    <v-card
      class="mt-4"
      border
      flat
    >
      <v-card-title class="text-subtitle-1 font-weight-bold text-grey pb-1">
        Statistics
      </v-card-title>
      <v-card-text class="px-0 pb-3">
        <v-list-item density="compact">
          <v-icon
            color="grey"
            class="mr-2"
          >
            mdi-calendar
          </v-icon>
          Days
          <template #append> 3 </template>
        </v-list-item>
        <v-list-item density="compact">
          <v-icon
            color="grey"
            class="mr-2"
          >
            mdi-bookshelf
          </v-icon>
          Memos
          <template #append> {{ memoStore.memoCount }} </template>
        </v-list-item>
        <v-list-item density="compact">
          <v-icon
            color="grey"
            class="mr-2"
          >
            mdi-tag-outline
          </v-icon>
          Tags
          <template #append> {{ memoStore.tagCount }} </template>
        </v-list-item>
      </v-card-text>
    </v-card>
    <div class="mt-4 ml-2">
      <div class="d-flex items-center align-center">
        <span class="text-subtitle-1 text-grey"> Tags </span>
        <v-btn
          class="ml-2"
          variant="text"
          icon="mdi-plus-box"
          density="compact"
          color="grey"
          @click="memoStore.openTagDialog"
        />
      </div>
      <div
        class="mt-2 d-flex flex-column flex-gap"
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
            size="15"
            :color="isInTagFilter(tag) ? tag.color : 'grey'"
          >
            mdi-pound
          </v-icon>
          <span> {{ tag.content }} </span>
        </v-chip>
      </div>
      <div
        class="text-grey text-caption mt-1"
        v-else
      >
        No tags found.
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { TagModel } from "@/models/tag";
import { useAppStore } from "@/store/app";
import { useMemoStore } from "@/store/memos";
import { reactive, watch } from "vue";
import { useDisplay, useTheme } from "vuetify";

const { mdAndUp } = useDisplay();
const appStore = useAppStore();
const memoStore = useMemoStore();
const theme = useTheme();

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
</style>
