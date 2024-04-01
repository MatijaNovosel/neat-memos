<template>
  <div class="d-flex flex-column flex-md-row md:flex-row bottom-box mx-auto">
    <v-select
      density="compact"
      hide-details
      prepend-inner-icon="mdi-earth"
      label="Language"
      class="mr-md-3 mb-3 mb-md-0"
    />
    <v-select
      hide-details
      prepend-inner-icon="mdi-moon-waning-crescent"
      :items="THEME_OPTIONS"
      v-model="state.selectedTheme"
      density="compact"
      @update:model-value="updateTheme"
    />
  </div>
</template>

<script setup lang="ts">
import { THEME_OPTIONS } from "@/constants/app";
import { useAppStore } from "@/store/app";
import { onMounted, reactive } from "vue";

interface State {
  selectedTheme: string | null;
}

const state: State = reactive({
  selectedTheme: null
});

const appStore = useAppStore();

const updateTheme = () => {
  appStore.setTheme(state.selectedTheme || "light");
};

onMounted(() => {
  state.selectedTheme = appStore.darkMode ? "dark" : "light";
});
</script>
