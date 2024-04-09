<template>
  <transition-group
    name="list"
    tag="div"
    class="alerts d-flex flex-column align-center"
  >
    <alert
      v-for="alert in alerts"
      :key="alert.timestamp"
      :alert="alert"
      class="mb-3"
      @close="removeAlert(alert)"
    />
  </transition-group>
</template>

<script setup lang="ts">
import { Alert as AlertModel } from "@/models/notification";
import { useNotificationStore } from "@/store/notification";
import { storeToRefs } from "pinia";
import Alert from "./Alert.vue";

const store = useNotificationStore();
const { alerts } = storeToRefs(store);

const removeAlert = (alert: AlertModel) => {
  store.removeAlert(alert);
};
</script>

<style scoped lang="scss">
.alerts {
  position: fixed;
  top: 15px;
  transform: translateX(calc(50vw - 50%));
  margin: 5px;
  text-align: center;
  z-index: 1000000000;
}
</style>
