import { defineStore } from "pinia";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useTheme } from "vuetify";

export const useAppStore = defineStore(
  "app",
  () => {
    // Data
    const loading = ref(false);
    const language = ref("en");
    const leftDrawer = ref(false);
    const rightDrawer = ref(false);
    const darkMode = ref(false);

    // Composables
    const theme = useTheme();
    const i18n = useI18n();

    const setLoading = (data: boolean) => {
      loading.value = data;
    };

    const triggerLeftDrawer = () => {
      leftDrawer.value = !leftDrawer.value;
    };

    const triggerRightDrawer = () => {
      rightDrawer.value = !rightDrawer.value;
    };

    const toggleDarkMode = () => {
      darkMode.value = !darkMode.value;
      theme.global.name.value = darkMode.value ? "dark" : "light";
    };

    const setTheme = (value: string) => {
      darkMode.value = value === "dark";
      theme.global.name.value = darkMode.value ? "dark" : "light";
    };

    const setLanguage = (lang: string) => {
      language.value = lang;
      i18n.locale.value = lang;
    };

    return {
      loading,
      leftDrawer,
      rightDrawer,
      darkMode,
      language,
      triggerRightDrawer,
      triggerLeftDrawer,
      setLoading,
      toggleDarkMode,
      setTheme,
      setLanguage
    };
  },
  {
    persist: {
      storage: sessionStorage,
      paths: ["darkMode", "language"]
    }
  }
);
