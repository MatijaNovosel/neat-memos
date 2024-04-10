<template>
  <v-container class="main-ctr h-100 align-center d-flex flex-column justify-center items-center">
    <span class="text-h1 mb-5"> 😿 </span>
    <span class="text-h4 mb-7"> Not found </span>
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
  </v-container>
</template>

<script setup lang="ts">
import ROUTE_NAMES from "@/router/routeNames";
</script>
