<template>
  <v-container class="main-ctr">
    <mobile-drawer-controls hide-right />
    <v-card
      class="pa-5"
      flat
      border
    >
      <v-card-text class="d-flex flex-column flex-gap">
        <v-select
          prepend-inner-icon="mdi-earth"
          hide-details
          density="compact"
          placeholder="Language"
        />
        <v-select
          prepend-inner-icon="mdi-moon-waning-crescent"
          hide-details
          density="compact"
          v-model="state.theme"
          :items="THEME_OPTIONS"
          placeholder="Theme"
          @update:model-value="updateTheme"
        />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/app";
import { THEME_OPTIONS } from "@/constants/app";
import { reactive } from "vue";
import { onMounted } from "vue";
import MobileDrawerControls from "@/components/mobileDrawerControls/MobileDrawerControls.vue";

interface State {
  theme: string | null;
}

const appStore = useAppStore();

const state: State = reactive({
  theme: null
});

const updateTheme = () => {
  appStore.setTheme(state.theme || "light");
};

onMounted(() => {
  state.theme = appStore.darkMode ? "dark" : "light";
});
</script>

<style scoped lang="scss">
.main-ctr {
  max-width: 60%;
  height: 100vh;
}

@media only screen and (max-width: 600px) {
  .main-ctr {
    max-width: 100%;
  }
}
</style>
