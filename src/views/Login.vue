<template>
  <div class="d-flex flex-column justify-space-between items-center h-100 pb-10">
    <div />
    <v-card
      width="400"
      flat
      class="pa-5 mx-auto"
    >
      <div class="text-center text-h1 text-orange mb-5">🐈</div>
      <div class="text-center text-h4 text-orange mb-5 font-weight-bold">Neat memos</div>
      <vv-form
        ref="loginForm"
        class="login-form"
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
              v-model="state.userName"
              name="username"
              rules="required"
              :label="i18n.t('username')"
            >
              <v-text-field
                v-bind="field"
                clearable
                variant="filled"
                density="compact"
                hide-details="auto"
                :error-messages="errors"
                :label="i18n.t('username')"
              />
            </vv-field>
          </v-col>
          <v-col
            cols="12"
            class="my-1"
          >
            <vv-field
              v-slot="{ field, errors }"
              v-model="state.password"
              name="password"
              rules="required"
              :label="i18n.t('password')"
            >
              <v-text-field
                clearable
                v-bind="field"
                variant="filled"
                density="compact"
                hide-details="auto"
                :error-messages="errors"
                :append-inner-icon="state.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="state.showPassword ? 'text' : 'password'"
                :label="i18n.t('password')"
                @click:append-inner="state.showPassword = !state.showPassword"
              />
            </vv-field>
          </v-col>
          <v-col cols="12">
            <v-checkbox
              hide-details
              label="Remember me"
            />
          </v-col>
          <v-col
            cols="12"
            class="text-center mb-4"
          >
            <v-btn
              type="submit"
              color="success"
              rounded="md"
            >
              {{ i18n.t("login") }}
            </v-btn>
          </v-col>
          <v-col
            cols="12"
            class="text-center"
          >
            Don't have an account?
            <v-btn
              class="ml-2"
              variant="text"
              color="error"
              size="x-small"
            >
              Sign up
            </v-btn>
          </v-col>
        </v-row>
      </vv-form>
    </v-card>
    <div class="d-flex bottom-box mx-auto flex-gap-2">
      <v-select
        density="compact"
        hide-details
        prepend-inner-icon="mdi-earth"
        label="Language"
        class="mr-3"
      />
      <v-select
        hide-details
        prepend-inner-icon="mdi-moon-waning-crescent"
        density="compact"
        label="Theme"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { IVuetifyForm } from "@/models/common";
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";

interface State {
  showPassword: boolean;
  userName: string | null;
  password: string | null;
}

const loginForm = ref<IVuetifyForm>();

const i18n = useI18n();

const state: State = reactive({
  userName: null,
  password: null,
  showPassword: false
});

const login = () => {
  //
};
</script>

<style scoped>
.bottom-box {
  width: 400px;
}
</style>
