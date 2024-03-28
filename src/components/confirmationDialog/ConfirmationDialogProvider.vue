<template>
  <div class="display-contents">
    <slot />
    <v-dialog
      v-model="state.isOpen"
      :max-width="state.options.width"
      :persistent="state.options.persistent"
    >
      <v-system-bar
        class="rounded-t-lg"
        height="15"
        :color="state.options.type"
      />
      <v-card class="pt-3">
        <div
          class="d-flex align-center px-10"
          :class="{
            'py-8': !state.options.content,
            'pt-8': !!state.options.content
          }"
        >
          <div>
            <v-icon
              :color="state.options.type"
              size="80"
            >
              {{
                state.options.icon || ConfirmationDialogTypeIcon[state.options.type || "success"]
              }}
            </v-icon>
          </div>
          <div class="pl-8">
            <div class="text-h3 font-weight-bold">
              {{ state.options.title }}
            </div>
            <div
              v-show="!!state.options.content"
              class="text-subtitle-1 pt-5 pb-6"
            >
              {{ state.options.content }}
            </div>
          </div>
        </div>
        <v-divider />
        <v-card-actions class="py-5 justify-end pr-5">
          <v-btn
            v-show="!!state.options.showCancel"
            color="error"
            variant="flat"
            rounded="lg"
            size="x-large"
            @click="cancel"
          >
            {{ i18n.t("no") }}
          </v-btn>
          <v-btn
            color="success"
            variant="flat"
            rounded="lg"
            size="x-large"
            @click="agree"
          >
            {{ i18n.t("yes") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { provide, reactive } from "vue";
import { useI18n } from "vue-i18n";
import {
  ConfirmationDialogTypeIcon,
  CreateConfirmDialogKey,
  CreateConfirmDialogOptions
} from "../../composables/useConfirmationDialog";

interface State {
  isOpen: boolean;
  resolve: (val: boolean) => void;
  reject: (val: boolean) => void;
  options: CreateConfirmDialogOptions;
}

const i18n = useI18n();

const state: State = reactive({
  isOpen: false,
  resolve: (_val: boolean) => {
    //
  },
  reject: (_val: boolean) => {
    //
  },
  options: {
    width: 800,
    showCancel: true,
    persistent: false,
    centerContent: true,
    title: `${i18n.t("areYouSure")}?`,
    type: "success"
  }
});

const createConfirmDialog = (
  options: CreateConfirmDialogOptions = {
    title: `${i18n.t("areYouSure")}?`,
    persistent: true
  }
) => {
  state.isOpen = true;
  state.options = Object.assign(state.options, options);
  return new Promise<boolean>((resolve, reject) => {
    state.resolve = resolve;
    state.reject = reject;
  });
};

provide(CreateConfirmDialogKey, createConfirmDialog);

const agree = () => {
  state.resolve(true);
  state.isOpen = false;
};

const cancel = () => {
  state.resolve(false);
  state.isOpen = false;
};
</script>
