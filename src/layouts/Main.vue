<template>
  <v-layout>
    <alerts />
    <left-drawer v-if="isAuthenticated" />
    <right-drawer v-if="isAuthenticated" />
    <v-main class="main">
      <router-view />
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import Alerts from "../components/notifications/Alerts.vue";
import LeftDrawer from "../components/navigation/LeftDrawer.vue";
import RightDrawer from "../components/navigation/RightDrawer.vue";
import { useUserStore } from "@/store/user";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { isAuthenticated } = storeToRefs(userStore);
</script>

<style scoped lang="scss">
.main {
  overflow: auto;
}
</style>
