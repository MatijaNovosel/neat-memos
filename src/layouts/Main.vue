<template>
  <v-layout>
    <alerts />
    <template v-if="isAuthenticated">
      <left-drawer />
      <right-drawer />
    </template>
    <v-main
      class="main"
      :class="theme.current.value.dark ? '' : 'bg-grey-lighten-4'"
    >
      <router-view />
    </v-main>
    <edit-memo-dialog />
    <preview-memo-dialog />
    <new-tag-dialog />
  </v-layout>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/user";
import { storeToRefs } from "pinia";
import { useTheme } from "vuetify";
import EditMemoDialog from "../components/editMemoDialog/EditMemoDialog.vue";
import LeftDrawer from "../components/navigation/LeftDrawer.vue";
import RightDrawer from "../components/navigation/RightDrawer.vue";
import NewTagDialog from "../components/newTagDialog/NewTagDialog.vue";
import Alerts from "../components/notifications/Alerts.vue";
import PreviewMemoDialog from "../components/previewMemoDialog/PreviewMemoDialog.vue";

const userStore = useUserStore();
const { isAuthenticated } = storeToRefs(userStore);
const theme = useTheme();
</script>

<style scoped lang="scss">
.main {
  overflow: auto;
}
</style>
