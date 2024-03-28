<template>
  <v-layout>
    <alerts />
    <v-main>
      <router-view />
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import Alerts from "../components/notifications/Alerts.vue";
</script>
