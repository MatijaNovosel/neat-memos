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
        rules="required"
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
              density="compact"
              class="py-0"
            >
              <v-list-item
                @click="handleAdditionalAction(item)"
                v-for="(item, i) in additionalActions"
                :key="i"
              >
                <v-list-item-title>
                  {{ item }}
                </v-list-item-title>
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
import { MEMO_VISIBILITY, memoVisibilityItems } from "@/constants/memo";
import { IVuetifyForm } from "@/models/common";
import { useMemoStore } from "@/store/memos";
import { reactive, ref } from "vue";

interface State {
  content: string | null;
  memoVisibility: number;
}

const additionalActions = ["preview", "addCodeBlock", "addChecklist"];

const memoForm = ref<IVuetifyForm>();

const memoStore = useMemoStore();

const state: State = reactive({
  content: null,
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

const saveMemo = async () => {
  if (!memoForm.value || !(await memoForm.value.validate()).valid) {
    return;
  }
  await memoStore.saveMemo(state.content as string);
  resetMemoForm();
};

const handleAdditionalAction = (action: string) => {
  //
};
</script>
