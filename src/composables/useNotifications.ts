import { useNotificationStore } from "@/store/notification";
import { randInt } from "../helpers/math";
import { CreateNotificationModel } from "../models/notification";

export const useNotifications = () => {
  const notificationStore = useNotificationStore();
  return {
    alert: (
      item: CreateNotificationModel = {
        text: "",
        type: "success",
        autoClose: true
      }
    ) => {
      const shouldAutoclose = item.autoClose ?? true;
      notificationStore.addAlert({
        id: randInt(1, 9999),
        timestamp: new Date().getTime(),
        autoclose: shouldAutoclose,
        timeout: 5000,
        closable: !shouldAutoclose,
        color: undefined,
        icon: false,
        text: item.text,
        type: item.type || "success",
        value: true
      });
    }
  };
};
