<template>
  <v-card
    color="white"
    class="mb-4 px-6 pb-4 d-flex flex-column"
    border
    flat
  >
    <vv-form
      ref="memoForm"
      as="v-form"
      @submit="saveMemo"
    >
      <vv-field
        v-slot="{ field, errors }"
        v-model="state.content"
        name="username"
        rules="required|max:2048"
        label="Content"
      >
        <v-textarea
          auto-grow
          v-bind="field"
          hide-details="auto"
          :error-messages="errors"
          row-height="15"
          rows="1"
          variant="plain"
          v-model="state.content"
          placeholder="Any thoughts..."
        />
      </vv-field>
      <div class="mt-4">
        <v-btn
          density="compact"
          variant="text"
          color="grey"
          icon
        >
          <v-icon> mdi-list-box-outline </v-icon>
          <v-menu activator="parent">
            <v-list
              border
              elevation="0"
              density="compact"
              class="py-0"
            >
              <v-list-item
                class="text-caption py-0"
                @click="handleAction(item.type)"
                v-for="(item, i) in memoAdditionalActionItems"
                :key="i"
              >
                <v-icon
                  :color="item.color"
                  class="mr-3"
                >
                  {{ item.icon }}
                </v-icon>
                <span>
                  {{ item.text }}
                </span>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-tooltip
            activator="parent"
            location="start"
          >
            Additional actions
          </v-tooltip>
        </v-btn>
        <v-btn
          density="compact"
          variant="text"
          class="mx-2"
          icon
          color="grey"
        >
          <v-icon> mdi-pound </v-icon>
          <v-tooltip
            activator="parent"
            location="start"
          >
            Add tag
          </v-tooltip>
        </v-btn>
        <v-btn
          density="compact"
          variant="text"
          color="grey"
          class="mr-2"
          icon
        >
          <v-icon> mdi-image-outline </v-icon>
          <v-tooltip
            activator="parent"
            location="start"
          >
            Add image
          </v-tooltip>
        </v-btn>
        <v-btn
          density="compact"
          variant="text"
          color="grey"
          icon
        >
          <v-icon> mdi-link-variant </v-icon>
          <v-tooltip
            activator="parent"
            location="start"
          >
            Add reference
          </v-tooltip>
        </v-btn>
      </div>
      <v-divider class="mt-3" />
      <v-row
        no-gutters
        align="center"
        class="mt-4"
      >
        <v-col cols="4">
          <v-select
            prepend-inner-icon="mdi-lock-outline"
            density="compact"
            hide-details
            placeholder="Visibility"
            :items="memoVisibilityItems"
            v-model="state.memoVisibility"
            class="mr-5 flex-shrink"
          />
        </v-col>
        <v-col cols="4"> </v-col>
        <v-col
          cols="4"
          class="d-flex justify-end"
        >
          <v-btn
            rounded="lg"
            color="orange"
            type="submit"
            variant="flat"
            class="text-capitalize"
          >
            Save
            <v-icon
              icon="mdi-send-outline"
              class="ml-2"
            />
          </v-btn>
        </v-col>
      </v-row>
    </vv-form>
  </v-card>
</template>

<script lang="ts" setup>
import {
  MEMO_VISIBILITY,
  memoVisibilityItems,
  MEMO_ADDITIONAL_ACTIONS,
  memoAdditionalActionItems,
  DEFAULT_CODE_BLOCK,
  DEFAULT_CHECK_LIST
} from "@/constants/memo";
import { IVuetifyForm } from "@/models/common";
import { useMemoStore } from "@/store/memos";
import { reactive, ref } from "vue";

interface Props {
  initialContent?: string | null;
}

const props = defineProps<Props>();

interface State {
  content: string | null;
  memoVisibility: number;
}

const memoForm = ref<IVuetifyForm>();

const memoStore = useMemoStore();

const state: State = reactive({
  content: props.initialContent || null,
  memoVisibility: MEMO_VISIBILITY.PRIVATE
});

const preview = () => {
  //
};

const resetMemoForm = () => {
  state.content = null;
  if (memoForm.value) {
    memoForm.value?.resetForm();
  }
};

const handleAction = (action: string) => {
  switch (action) {
    case MEMO_ADDITIONAL_ACTIONS.PREVIEW:
      break;
    case MEMO_ADDITIONAL_ACTIONS.ADD_CODE_BLOCK:
      if (state.content) {
        state.content += DEFAULT_CODE_BLOCK;
      } else {
        state.content = DEFAULT_CODE_BLOCK;
      }
      break;
    case MEMO_ADDITIONAL_ACTIONS.ADD_CHECKLIST:
      if (state.content) {
        state.content += DEFAULT_CHECK_LIST;
      } else {
        state.content = DEFAULT_CHECK_LIST;
      }
      break;
  }
};

const saveMemo = async () => {
  if (!memoForm.value || !(await memoForm.value.validate()).valid) {
    return;
  }
  const content = state.content || "No content";
  if (memoStore.activeMemo) {
    await memoStore.editMemo(content);
  } else {
    await memoStore.saveMemo(content);
  }
  resetMemoForm();
};

const handleAdditionalAction = (action: string) => {
  //
};
</script>
