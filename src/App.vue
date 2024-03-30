<template>
  <v-app>
    <v-overlay
      v-model="loading"
      persistent
      contained
      z-index="2000"
      class="align-center justify-center"
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="160"
        width="16"
      >
        <v-icon
          class="pulse"
          size="70"
        >
          mdi-timer-sand
        </v-icon>
      </v-progress-circular>
    </v-overlay>
    <confirmation-dialog-provider>
      <router-view />
    </confirmation-dialog-provider>
  </v-app>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import ConfirmationDialogProvider from "./components/confirmationDialog/ConfirmationDialogProvider.vue";
import { useAppStore } from "./store/app";
import { onMounted } from "vue";
import { useTheme } from "vuetify";

const appStore = useAppStore();
const theme = useTheme();
const { loading } = storeToRefs(appStore);

onMounted(() => {
  theme.global.name.value = appStore.darkMode ? "dark" : "light";
});
</script>
