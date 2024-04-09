<template>
  <div class="d-flex flex-column flex-md-row md:flex-row bottom-box mx-auto">
    <v-select
      density="compact"
      hide-details
      prepend-inner-icon="mdi-earth"
      :bg-color="theme.current.value.dark ? '' : 'white'"
      class="mr-md-3 mb-3 mb-md-0"
      v-model="state.language"
      :items="LANGUAGE_OPTIONS"
      :placeholder="i18n.t('language')"
      @update:model-value="updateLanguage"
    />
    <v-select
      hide-details
      prepend-inner-icon="mdi-moon-waning-crescent"
      :bg-color="theme.current.value.dark ? '' : 'white'"
      :items="THEME_OPTIONS"
      v-model="state.theme"
      density="compact"
      :placeholder="i18n.t('theme')"
      @update:model-value="updateTheme"
    />
  </div>
</template>

<script setup lang="ts">
import { LANGUAGE_OPTIONS, THEME_OPTIONS } from "@/constants/app";
import { useAppStore } from "@/store/app";
import { onMounted, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useTheme } from "vuetify";

interface State {
  theme: string | null;
  language: string | null;
}

const state: State = reactive({
  theme: null,
  language: null
});

const appStore = useAppStore();
const i18n = useI18n();
const theme = useTheme();

const updateTheme = () => {
  appStore.setTheme(state.theme || "light");
};

const updateLanguage = () => {
  appStore.setLanguage(state.language || "en");
};

onMounted(() => {
  state.theme = appStore.darkMode ? "dark" : "light";
  state.language = appStore.language;
});
</script>
