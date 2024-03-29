import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppStore = defineStore("app", () => {
  const loading = ref(false);
  const leftDrawer = ref(false);
  const rightDrawer = ref(false);

  const setLoading = (data: boolean) => {
    loading.value = data;
  };

  const triggerLeftDrawer = () => {
    leftDrawer.value = !leftDrawer.value;
  };

  const triggerRightDrawer = () => {
    rightDrawer.value = !rightDrawer.value;
  };

  return {
    loading,
    setLoading,
    triggerLeftDrawer,
    triggerRightDrawer,
    leftDrawer,
    rightDrawer
  };
});
