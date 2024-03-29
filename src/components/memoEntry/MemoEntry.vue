<template>
  <v-card
    color="white"
    class="mb-4 px-6 pb-4 d-flex flex-column"
    border
    flat
  >
    <v-textarea
      auto-grow
      hide-details
      row-height="15"
      rows="1"
      variant="plain"
      v-model="state.content"
      placeholder="Any thoughts..."
    />
    <div class="mt-4">
      <v-btn
        density="compact"
        variant="text"
        color="grey"
        icon="mdi-pound"
      />
      <v-btn
        density="compact"
        variant="text"
        color="grey"
        class="mx-2"
        icon="mdi-list-box-outline"
      />
      <v-btn
        density="compact"
        variant="text"
        color="grey"
        class="mr-2"
        icon="mdi-image-outline"
      />
      <v-btn
        density="compact"
        variant="text"
        color="grey"
        icon="mdi-link-variant"
      />
    </div>
    <v-divider class="mt-3" />
    <v-row
      no-gutters
      align="center"
      class="mt-4"
    >
      <v-col cols="4">
        <v-select
          prepend-inner-icon="mdi-lock-outline"
          density="compact"
          hide-details
          placeholder="Visibility"
          class="mr-5 flex-shrink"
        />
      </v-col>
      <v-col cols="4"> </v-col>
      <v-col
        cols="4"
        class="d-flex justify-end"
      >
        <v-btn
          rounded="lg"
          color="orange-lighten-3"
          variant="flat"
          class="text-capitalize mr-3"
          @click="preview"
        >
          Preview
          <v-icon
            icon="mdi-magnify"
            class="ml-2"
          />
        </v-btn>
        <v-btn
          rounded="lg"
          color="orange"
          variant="flat"
          class="text-capitalize"
        >
          Save
          <v-icon
            icon="mdi-send-outline"
            class="ml-2"
          />
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

interface State {
  content: string | null;
}

const state: State = reactive({
  content: null
});

const preview = () => {
  //
};
</script>
