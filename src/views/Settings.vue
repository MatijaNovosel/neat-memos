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
            v-model="state.username"
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
              v-model="state.username"
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
          v-model="state.language"
          :items="LANGUAGE_OPTIONS"
          :placeholder="i18n.t('language')"
          @update:model-value="updateLanguage"
        />
        <v-select
          prepend-icon="mdi-moon-waning-crescent"
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
import { LANGUAGE_OPTIONS, THEME_OPTIONS } from "@/constants/app";
import { IForm } from "@/models/common";
import { useAppStore } from "@/store/app";
import { useUserStore } from "@/store/user";
import { onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";

interface State {
  theme: string | null;
  language: string | null;
  username: string | null;
}

const i18n = useI18n();
const appStore = useAppStore();
const userStore = useUserStore();

const userDataForm = ref<IForm>();

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

const updateUserData = async () => {
  await userStore.updateUsername(state.username || "");
};

onMounted(() => {
  state.theme = appStore.darkMode ? "dark" : "light";
  state.language = appStore.language;
  state.username = userStore.user?.userName || null;
});
</script>
