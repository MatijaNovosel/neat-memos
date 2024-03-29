import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppStore = defineStore("app", () => {
  const loading = ref(false);
  const leftDrawer = ref(false);

  const setLoading = (data: boolean) => {
    loading.value = data;
  };

  const triggerLeftDrawer = () => {
    leftDrawer.value = !leftDrawer.value;
  };

  return {
    loading,
    setLoading,
    triggerLeftDrawer,
    leftDrawer
  };
});
