<template>
  <div class="d-flex flex-column flex-md-row md:flex-row bottom-box mx-auto">
    <v-select
      density="compact"
      hide-details
      prepend-inner-icon="mdi-earth"
      :bg-color="appStore.darkMode ? '' : 'white'"
      class="mr-md-3 mb-3 mb-md-0"
      v-model="language"
      :items="LANGUAGE_OPTIONS"
      :placeholder="i18n.t('language')"
      @update:model-value="updateLanguage"
    />
    <v-select
      hide-details
      prepend-inner-icon="mdi-moon-waning-crescent"
      :bg-color="appStore.darkMode ? '' : 'white'"
      :items="THEME_OPTIONS"
      v-model="theme"
      density="compact"
      :placeholder="i18n.t('theme')"
      @update:model-value="updateTheme"
    />
  </div>
</template>

<script setup lang="ts">
import { LANGUAGE_OPTIONS, THEME_OPTIONS } from "@/constants/app";
import { useAppStore } from "@/store/app";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const theme = ref<string | null>(null);
const language = ref<string | null>(null);

const appStore = useAppStore();
const i18n = useI18n();

const updateTheme = () => {
  appStore.setTheme(theme.value || "light");
};

const updateLanguage = () => {
  appStore.setLanguage(language.value || "en");
};

onMounted(() => {
  theme.value = appStore.darkMode ? "dark" : "light";
  language.value = appStore.language;
});
</script>
