<template>
  <v-alert
    :class="props.alert.closable ? 'pl-8' : ''"
    class="py-1 px-6 unselectable"
    density="compact"
    rounded="lg"
    :color="props.alert.type"
    width="fit-content"
    :model-value="props.alert.value"
  >
    <span class="text-subtitle-1">
      {{ props.alert.text }}
    </span>
    <template
      v-if="props.alert.closable"
      #append
    >
      <v-btn
        variant="text"
        color="white"
        icon="mdi-close"
        @click="close"
      />
    </template>
  </v-alert>
</template>

<script setup lang="ts">
import { Alert } from "@/models/notification";
import { onMounted } from "vue";

const props = defineProps<{
  alert: Alert;
}>();

const emits = defineEmits<{
  (e: "close"): void;
}>();

const close = () => {
  emits("close");
};

onMounted(() => {
  if (props.alert.autoclose) {
    setTimeout(close, props.alert.timeout);
  }
});
</script>
