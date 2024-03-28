import { defineStore } from "pinia";
import { Alert } from "src/models/notification";
import { ref } from "vue";

export const useNotificationStore = defineStore("notification", () => {
  const alerts = ref<Alert[]>([]);

  const addAlert = (alert: Alert) => {
    if (!alerts.value.some((a) => a.id === alert.id)) {
      alerts.value.push(alert);
    }
  };

  const removeAlert = (alert: Alert) => {
    const indexToDelete = alerts.value.findIndex((n) => n.id === alert.id);
    if (indexToDelete !== -1) {
      alerts.value.splice(indexToDelete, 1);
    }
  };

  return {
    alerts,
    removeAlert,
    addAlert
  };
});
