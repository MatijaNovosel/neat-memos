<template>
  <v-layout>
    <alerts />
    <left-drawer v-if="isAuthenticated" />
    <right-drawer v-if="isAuthenticated" />
    <v-main class="main bg-grey-lighten-4">
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
import LeftDrawer from "../components/navigation/LeftDrawer.vue";
import RightDrawer from "../components/navigation/RightDrawer.vue";
import Alerts from "../components/notifications/Alerts.vue";
import EditMemoDialog from "../components/editMemoDialog/EditMemoDialog.vue";
import PreviewMemoDialog from "../components/previewMemoDialog/PreviewMemoDialog.vue";
import NewTagDialog from "../components/newTagDialog/NewTagDialog.vue";

const userStore = useUserStore();
const { isAuthenticated } = storeToRefs(userStore);
</script>

<style scoped lang="scss">
.main {
  overflow: auto;
}
</style>
