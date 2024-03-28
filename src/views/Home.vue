<template>
  <v-container class="main-ctr">
    <v-row>
      <v-col
        cols="12"
        v-for="n in 10"
        :key="n"
      >
        <memo />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import Memo from "@/components/Memo.vue";
</script>

<style scoped lang="scss">
.main-ctr {
  max-width: 80%;
  height: 100vh;
}
</style>
