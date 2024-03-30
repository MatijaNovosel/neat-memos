import { defineStore } from "pinia";
import { ref } from "vue";
import { useTheme } from "vuetify";

export const useAppStore = defineStore(
  "app",
  () => {
    // Data
    const loading = ref(false);
    const leftDrawer = ref(false);
    const rightDrawer = ref(false);
    const darkMode = ref(false);

    // Composables
    const theme = useTheme();

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

    return {
      loading,
      setLoading,
      triggerLeftDrawer,
      triggerRightDrawer,
      leftDrawer,
      rightDrawer,
      darkMode,
      toggleDarkMode,
      setTheme
    };
  },
  {
    persist: {
      storage: sessionStorage
    }
  }
);
