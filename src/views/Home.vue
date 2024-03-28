<template>
  <v-container class="main-ctr">
    <v-card
      class="mb-4 pa-4 d-flex flex-column"
      border
      flat
    >
      <v-textarea
        hide-details
        variant="filled"
        placeholder="Any thoughts..."
      />
      <div class="mt-4 d-flex justify-end">
        <v-btn
          rounded="8"
          color="orange-darken-1"
          class="text-capitalize"
        >
          Save
          <v-icon class="ml-2"> mdi-send </v-icon>
        </v-btn>
      </div>
    </v-card>
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
