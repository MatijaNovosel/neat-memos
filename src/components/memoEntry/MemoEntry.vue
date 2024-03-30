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
          :readonly="props.readonly"
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
          :disabled="props.readonly"
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
          :disabled="interactionDisabled"
          density="compact"
          variant="text"
          class="mx-2"
          icon
          @click="state.tagMenuExpanded = !state.tagMenuExpanded"
          :color="state.tagMenuExpanded ? 'orange' : 'grey'"
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
          :disabled="interactionDisabled"
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
          :disabled="interactionDisabled"
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
      <v-expand-transition>
        <div
          class="d-flex flex-wrap flex-gap mt-3"
          v-if="state.tagMenuExpanded"
        >
          <v-chip
            density="compact"
            :color="isInSelectedTags(tag.id) ? tag.color : 'grey'"
            v-for="tag in memoStore.tags"
            :key="tag.id"
            @click="addToSelectedTags(tag)"
          >
            <v-icon
              class="mr-2"
              size="15"
            >
              mdi-pound
            </v-icon>
            <span> {{ tag.content }} </span>
          </v-chip>
        </div>
      </v-expand-transition>
      <v-divider class="mt-3" />
      <v-row
        no-gutters
        align="center"
        class="mt-4"
      >
        <v-col cols="4">
          <v-select
            :disabled="interactionDisabled"
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
            :disabled="interactionDisabled"
            rounded="lg"
            :color="interactionDisabled ? 'grey' : 'orange'"
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
import { TagModel } from "@/models/tag";
import { useMemoStore } from "@/store/memos";
import { computed } from "vue";
import { reactive, ref } from "vue";

interface Props {
  initialContent?: string | null;
  initialTags?: TagModel[];
  readonly?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  disabled: false
});

interface State {
  content: string | null;
  memoVisibility: number;
  selectedTags: TagModel[];
  tagMenuExpanded: boolean;
}

const memoForm = ref<IVuetifyForm>();

const memoStore = useMemoStore();

const state: State = reactive({
  content: props.initialContent || null,
  memoVisibility: MEMO_VISIBILITY.PRIVATE,
  selectedTags: [...(props.initialTags || [])],
  tagMenuExpanded: true
});

const resetMemoForm = () => {
  state.content = null;
  if (memoForm.value) {
    memoForm.value?.resetForm();
  }
};

const handleAction = (action: string) => {
  switch (action) {
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
    case MEMO_ADDITIONAL_ACTIONS.PREVIEW:
      memoStore.setActiveMemo({
        content: state.content || "",
        id: -1,
        createdAt: new Date().toISOString(),
        pinned: false,
        userId: "",
        tags: state.selectedTags
      });
      memoStore.openPreviewDialog();
      break;
  }
};

const saveMemo = async () => {
  if (!memoForm.value || !(await memoForm.value.validate()).valid) {
    return;
  }
  const content = state.content || "No content";
  if (memoStore.activeMemo) {
    await memoStore.editMemo(content, state.selectedTags);
  } else {
    await memoStore.saveMemo(content, state.selectedTags);
  }
  resetMemoForm();
};

const isInSelectedTags = (tagId: number) => {
  return !!state.selectedTags.find((t) => t.id === tagId);
};

const addToSelectedTags = (tag: TagModel) => {
  if (!!state.selectedTags.find((t) => t.id === tag.id)) {
    state.selectedTags = state.selectedTags.filter((t) => t.id !== tag.id);
    return;
  }
  state.selectedTags.push(tag);
};

const interactionDisabled = computed(() => {
  return props.disabled || props.readonly;
});
</script>
