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
      <div class="text-center mb-3">
        {{ i18n.t("createYourAccount") }}
      </div>
      <vv-form
        ref="registerForm"
        as="v-form"
        @submit="register"
      >
        <v-row no-gutters>
          <v-col
            cols="12"
            class="my-2"
          >
            <vv-field
              v-slot="{ field, errors }"
              v-model="username"
              name="register-username"
              rules="required|min:3|alpha_num"
              :label="i18n.t('username')"
            >
              <v-text-field
                v-bind="field"
                clearable
                variant="filled"
                density="compact"
                hide-details="auto"
                :error-messages="errors"
                prepend-icon="mdi-account-outline"
                :placeholder="i18n.t('username')"
              />
            </vv-field>
          </v-col>
          <v-col
            cols="12"
            class="my-2"
          >
            <vv-field
              v-slot="{ field, errors }"
              v-model="email"
              name="register-email"
              rules="required|email"
              :label="i18n.t('email')"
            >
              <v-text-field
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
              name="register-password"
              rules="required|min:6"
              :label="i18n.t('password')"
            >
              <v-text-field
                clearable
                v-bind="field"
                variant="filled"
                density="compact"
                hide-details="auto"
                :error-messages="errors"
                prepend-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="i18n.t('password')"
                @click:append-inner="showPassword = !showPassword"
              />
            </vv-field>
          </v-col>
          <v-col
            cols="12"
            class="text-center my-4"
          >
            <v-btn
              variant="flat"
              type="submit"
              color="orange-darken-1"
              rounded="md"
            >
              {{ i18n.t("register") }}
            </v-btn>
          </v-col>
          <v-col
            cols="12"
            class="text-center text-caption"
          >
            {{ i18n.t("alreadyHaveAnAccount") }}
            <router-link
              class="text-orange text-decoration-none font-weight-bold"
              :to="{
                name: ROUTE_NAMES.LOGIN
              }"
            >
              {{ i18n.t("signIn") }}
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
import { useDisplay } from "vuetify";

const registerForm = ref<IForm>();
const userStore = useUserStore();
const appStore = useAppStore();
const i18n = useI18n();
const { smAndDown } = useDisplay();
const { alert } = useNotifications();

const username = ref("");
const password = ref("");
const email = ref("");
const showPassword = ref(false);

const resetForm = () => {
  username.value = "";
  password.value = "";
  email.value = "";
  if (registerForm.value) {
    registerForm.value?.resetForm();
  }
};

const register = async () => {
  if (!registerForm.value || !(await registerForm.value.validate()).valid) {
    return;
  }
  try {
    appStore.setLoading(true);
    await userStore.register(email.value, password.value, username.value);
    alert({
      text: i18n.t("accountCreated")
    });
  } catch (e) {
    alert({
      text: i18n.t("failedToRegister", [e]),
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
