<template>
  <div class="d-flex flex-column flex-md-row md:flex-row bottom-box mx-auto">
    <language-picker class="mr-md-3 mb-3 mb-md-0" />
    <v-select
      hide-details
      prepend-inner-icon="mdi-moon-waning-crescent"
      :items="THEME_OPTIONS"
      v-model="theme"
      density="compact"
      :placeholder="i18n.t('theme')"
      @update:model-value="updateTheme"
    />
  </div>
</template>

<script setup lang="ts">
import LanguagePicker from "@/components/languagePicker/LanguagePicker.vue";
import { THEME_OPTIONS } from "@/constants/app";
import { useAppStore } from "@/store/app";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const theme = ref<string | null>(null);

const appStore = useAppStore();
const i18n = useI18n();

const updateTheme = () => {
  appStore.setTheme(theme.value || "light");
};

onMounted(() => {
  theme.value = appStore.darkMode ? "dark" : "light";
});
</script>
