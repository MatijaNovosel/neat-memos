<template>
  <div class="d-flex flex-column justify-space-between items-center h-100 pb-10">
    <div />
    <v-card
      :width="smAndDown ? '100%' : '400'"
      flat
      color="transparent"
      class="pa-5 mx-auto"
    >
      <logo-header />
      <vv-form
        ref="loginForm"
        as="v-form"
        @submit="login"
      >
        <v-row no-gutters>
          <v-col
            cols="12"
            class="my-2"
          >
            <vv-field
              v-slot="{ field, errors }"
              v-model="email"
              name="email"
              rules="required|email"
              :label="i18n.t('email')"
            >
              <v-text-field
                type="email"
                :bg-color="theme.current.value.dark ? '' : 'white'"
                v-bind="field"
                clearable
                variant="filled"
                density="compact"
                hide-details="auto"
                prepend-icon="mdi-email-outline"
                :error-messages="errors"
                :placeholder="i18n.t('email')"
              />
            </vv-field>
          </v-col>
          <v-col
            cols="12"
            class="my-1"
          >
            <vv-field
              v-slot="{ field, errors }"
              v-model="password"
              name="password"
              rules="required"
              :label="i18n.t('password')"
            >
              <v-text-field
                clearable
                v-bind="field"
                :bg-color="theme.current.value.dark ? '' : 'white'"
                variant="filled"
                density="compact"
                hide-details="auto"
                prepend-icon="mdi-lock-outline"
                :error-messages="errors"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="i18n.t('password')"
                @click:append-inner="showPassword = !showPassword"
              />
            </vv-field>
          </v-col>
          <v-col cols="12">
            <v-checkbox
              color="orange"
              hide-details
              :label="i18n.t('rememberMe')"
            />
          </v-col>
          <v-col
            cols="12"
            class="text-center mb-4"
          >
            <v-btn
              variant="flat"
              type="submit"
              color="orange-darken-1"
              rounded="md"
            >
              {{ i18n.t("login") }}
            </v-btn>
          </v-col>
          <v-col
            cols="12"
            class="text-center text-caption"
          >
            {{ i18n.t("dontHaveAnAccount") }}
            <router-link
              class="text-orange text-decoration-none font-weight-bold"
              :to="{
                name: ROUTE_NAMES.REGISTER
              }"
            >
              {{ i18n.t("signUp") }}
            </router-link>
          </v-col>
        </v-row>
      </vv-form>
    </v-card>
    <bottom-options />
  </div>
</template>

<script setup lang="ts">
import BottomOptions from "@/components/bottomOptions/BottomOptions.vue";
import LogoHeader from "@/components/logoHeader/LogoHeader.vue";
import { useNotifications } from "@/composables/useNotifications";
import { IForm } from "@/models/common";
import ROUTE_NAMES from "@/router/routeNames";
import { useAppStore } from "@/store/app";
import { useUserStore } from "@/store/user";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useDisplay, useTheme } from "vuetify";

const loginForm = ref<IForm>();
const email = ref("");
const password = ref("");
const showPassword = ref(false);

const userStore = useUserStore();
const appStore = useAppStore();
const i18n = useI18n();
const router = useRouter();
const theme = useTheme();
const { smAndDown } = useDisplay();
const { alert } = useNotifications();

const resetForm = () => {
  email.value = "";
  password.value = "";
  if (loginForm.value) {
    loginForm.value?.resetForm();
  }
};

const login = async () => {
  if (!loginForm.value || !(await loginForm.value.validate()).valid) {
    return;
  }
  try {
    appStore.setLoading(true);
    await userStore.login(email.value, password.value);
    router.push({
      name: ROUTE_NAMES.HOME
    });
    alert({
      text: i18n.t("welcome")
    });
  } catch (e) {
    alert({
      text: i18n.t("failedToLogIn", [e]),
      type: "error"
    });
  } finally {
    resetForm();
    appStore.setLoading(false);
  }
};
</script>

<style scoped>
@media only screen and (max-width: 600px) {
  .bottom-box {
    width: 65% !important;
  }
}

.bottom-box {
  width: 400px;
}
</style>
