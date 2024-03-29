<template>
  <v-navigation-drawer
    location="right"
    :order="1"
    v-model="state.drawer"
    :permanent="mdAndUp"
    class="pa-5 right-drawer bg-grey-lighten-4"
  >
    <template #prepend>
      <v-text-field
        class="bg-white"
        placeholder="Search memos"
        density="compact"
        hide-details
        variant="outlined"
        prepend-inner-icon="mdi-magnify"
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
          <template #append> 2 </template>
        </v-list-item>
        <v-list-item density="compact">
          <v-icon
            color="grey"
            class="mr-2"
          >
            mdi-tag-outline
          </v-icon>
          Tags
          <template #append> 3 </template>
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
        />
      </div>
      <div class="mt-2">
        <div class="d-flex align-center">
          <v-icon
            class="mr-2"
            size="15"
            color="grey"
          >
            mdi-pound
          </v-icon>
          <span> todo </span>
        </div>
        <div class="d-flex align-center">
          <v-icon
            class="mr-2"
            size="15"
            color="grey"
          >
            mdi-pound
          </v-icon>
          <span> diy </span>
        </div>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { useDisplay } from "vuetify";

const { mdAndUp } = useDisplay();

const state = reactive({
  drawer: true
});
</script>

<style scoped lang="scss">
.right-drawer {
  border: 0;
}
</style>
