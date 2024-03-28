import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppStore = defineStore("app", () => {
  const loading = ref(false);
  const appVersion = ref("0.0.0");

  const setLoading = (data: boolean) => {
    loading.value = data;
  };

  return {
    loading,
    appVersion,
    setLoading
  };
});
