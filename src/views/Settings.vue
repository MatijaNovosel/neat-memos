<template>
  <v-container class="main-ctr">
    <mobile-drawer-controls hide-right />
    <v-card
      class="pa-5"
      flat
      border
    >
      <v-card-text class="d-flex flex-column flex-gap">
        <div class="text-grey">
          {{ i18n.t("userData") }}
        </div>
        <v-text-field
          prepend-inner-icon="mdi-account-outline"
          hide-details
          v-model="state.username"
          density="compact"
          :placeholder="i18n.t('username')"
        />
      </v-card-text>
      <v-card-text class="d-flex flex-column flex-gap pt-0">
        <div class="text-grey">
          {{ i18n.t("appPreferences") }}
        </div>
        <v-select
          prepend-inner-icon="mdi-earth"
          hide-details
          density="compact"
          v-model="state.language"
          :items="LANGUAGE_OPTIONS"
          :placeholder="i18n.t('language')"
          @update:model-value="updateLanguage"
        />
        <v-select
          prepend-inner-icon="mdi-moon-waning-crescent"
          hide-details
          density="compact"
          v-model="state.theme"
          :items="THEME_OPTIONS"
          :placeholder="i18n.t('theme')"
          @update:model-value="updateTheme"
        />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import MobileDrawerControls from "@/components/mobileDrawerControls/MobileDrawerControls.vue";
import { LANGUAGE_OPTIONS, THEME_OPTIONS } from "@/constants/app";
import { useAppStore } from "@/store/app";
import { useUserStore } from "@/store/user";
import { onMounted, reactive } from "vue";
import { useI18n } from "vue-i18n";

interface State {
  theme: string | null;
  language: string | null;
  username: string | null;
}

const i18n = useI18n();
const appStore = useAppStore();
const userStore = useUserStore();

const state: State = reactive({
  theme: null,
  language: null,
  username: null
});

const updateTheme = () => {
  appStore.setTheme(state.theme || "light");
};

const updateLanguage = () => {
  appStore.setLanguage(state.language || "en");
};

onMounted(() => {
  state.theme = appStore.darkMode ? "dark" : "light";
  state.language = appStore.language;
  state.username = userStore.user?.userName || null;
});
</script>
