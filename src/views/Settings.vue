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
        <vv-form
          class="d-flex flex-column align-end"
          ref="userDataForm"
          as="v-form"
          @submit="updateUserData"
        >
          <vv-field
            v-slot="{ field, errors }"
            v-model="username"
            name="username"
            rules="required|min:3"
            :label="i18n.t('username')"
          >
            <v-text-field
              v-bind="field"
              class="w-100"
              hide-details="auto"
              :error-messages="errors"
              prepend-icon="mdi-account"
              v-model="username"
              density="compact"
              :placeholder="i18n.t('username')"
            />
          </vv-field>
          <v-btn
            class="mt-4"
            rounded="12"
            type="submit"
            color="orange-darken-1"
          >
            Save
          </v-btn>
        </vv-form>
      </v-card-text>
      <v-card-text class="d-flex flex-column flex-gap pt-0">
        <div class="text-grey">
          {{ i18n.t("appPreferences") }}
        </div>
        <v-select
          prepend-icon="mdi-earth"
          hide-details
          density="compact"
          v-model="language"
          :items="LANGUAGE_OPTIONS"
          :placeholder="i18n.t('language')"
          @update:model-value="updateLanguage"
        />
        <v-select
          prepend-icon="mdi-moon-waning-crescent"
          hide-details
          density="compact"
          v-model="theme"
          :items="THEME_OPTIONS"
          :placeholder="i18n.t('theme')"
          @update:model-value="updateTheme"
        />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { LANGUAGE_OPTIONS, THEME_OPTIONS } from "@/constants/app";
import { IForm } from "@/models/common";
import { useAppStore } from "@/store/app";
import { useUserStore } from "@/store/user";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const i18n = useI18n();
const appStore = useAppStore();
const userStore = useUserStore();

const theme = ref<string | null>(null);
const language = ref<string | null>(null);
const username = ref<string | null>(null);
const userDataForm = ref<IForm>();

const updateTheme = () => {
  appStore.setTheme(theme.value || "light");
};

const updateLanguage = () => {
  appStore.setLanguage(language.value || "en");
};

const updateUserData = async () => {
  await userStore.updateUsername(username.value || "");
};

onMounted(() => {
  theme.value = appStore.darkMode ? "dark" : "light";
  language.value = appStore.language;
  username.value = userStore.user?.userName || null;
});
</script>
