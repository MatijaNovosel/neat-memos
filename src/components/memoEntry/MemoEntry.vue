<template>
  <v-card
    :color="theme.current.value.dark ? '' : 'white'"
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
        name="content"
        rules="required|max:2048|min:3"
        :label="i18n.t('content')"
      >
        <v-textarea
          :readonly="props.readonly || state.loading"
          auto-grow
          v-bind="field"
          hide-details="auto"
          :error-messages="errors"
          row-height="15"
          rows="1"
          variant="plain"
          v-model="state.content"
          :placeholder="i18n.t('anyThoughts')"
        />
      </vv-field>
      <div class="mt-4">
        <v-btn
          :disabled="interactionDisabled"
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
            {{ i18n.t("additionalActions") }}
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
            {{ i18n.t("addTag") }}
          </v-tooltip>
        </v-btn>
        <v-btn
          :disabled="interactionDisabled"
          density="compact"
          variant="text"
          color="grey"
          class="mr-2"
          @click="openImageDialog"
          icon
        >
          <v-icon> mdi-paperclip </v-icon>
          <v-tooltip
            activator="parent"
            location="start"
          >
            {{ i18n.t("addFile") }}
          </v-tooltip>
        </v-btn>
        <v-btn
          :disabled="interactionDisabled"
          density="compact"
          variant="text"
          color="grey"
          @click="addReference"
          icon
        >
          <v-icon> mdi-link-variant </v-icon>
          <v-tooltip
            activator="parent"
            location="start"
          >
            {{ i18n.t("addReference") }}
          </v-tooltip>
        </v-btn>
      </div>
      <v-expand-transition>
        <div
          class="d-flex flex-wrap flex-gap mt-3"
          v-if="state.tagMenuExpanded"
        >
          <template v-if="memoStore.tags.length">
            <v-chip
              :disabled="interactionDisabled"
              density="compact"
              :color="isInSelectedTags(tag.id) ? tag.color : 'grey'"
              v-for="tag in memoStore.tags"
              :key="tag.id"
              @click="addToSelectedTags(tag)"
            >
              <v-icon
                class="mr-2"
                size="18"
              >
                {{ isInSelectedTags(tag.id) ? "mdi-pound-box" : "mdi-pound-box-outline" }}
              </v-icon>
              <span> {{ tag.content }} </span>
            </v-chip>
          </template>
          <div
            class="text-grey text-subtitle-2"
            v-else
          >
            {{ i18n.t("noTagsFound") }}
          </div>
        </div>
      </v-expand-transition>
      <v-divider class="mt-3" />
      <div
        class="mt-3 d-flex flex-wrap flex-gap"
        v-if="state.files.length"
      >
        <v-chip
          :disabled="interactionDisabled"
          color="orange"
          density="compact"
          @click="removeFile(i)"
          v-for="(file, i) in state.files"
          :key="i"
        >
          <v-icon
            class="mr-1"
            size="14"
          >
            mdi-paperclip
          </v-icon>
          {{ file.name }} ({{ fileSizeReadable(file.size) }})
        </v-chip>
      </div>
      <v-row
        no-gutters
        align="center"
        class="mt-4"
      >
        <v-col cols="4">
          <v-select
            :disabled="interactionDisabled"
            prepend-inner-icon="mdi-eye"
            density="compact"
            hide-details
            :placeholder="i18n.t('visibility')"
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
            :loading="state.loading"
            variant="flat"
            class="text-capitalize"
          >
            {{ i18n.t("save") }}
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
import { useNotifications } from "@/composables/useNotifications";
import { MAX_FILE_SIZE } from "@/constants/app";
import {
  DEFAULT_CHECK_LIST,
  DEFAULT_CODE_BLOCK,
  MEMO_ADDITIONAL_ACTIONS,
  MEMO_VISIBILITY,
  memoAdditionalActionItems,
  memoVisibilityItems
} from "@/constants/memo";
import { fileSizeReadable } from "@/helpers/file";
import { IForm } from "@/models/common";
import { MemoFile } from "@/models/memo";
import { TagModel } from "@/models/tag";
import { useMemoStore } from "@/store/memos";
import { useFileDialog } from "@vueuse/core";
import { computed, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useTheme } from "vuetify";

interface Props {
  initialContent?: string | null;
  initialTags?: TagModel[];
  initialFiles?: MemoFile[];
  readonly?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  disabled: false
});

interface State {
  files: Array<MemoFile | File>;
  content: string | null;
  memoVisibility: number;
  selectedTags: TagModel[];
  tagMenuExpanded: boolean;
  loading: boolean;
}

const theme = useTheme();

const memoForm = ref<IForm>();

const memoStore = useMemoStore();
const i18n = useI18n();
const { alert } = useNotifications();

const {
  open: openImageDialog,
  reset: resetFileDialog,
  onChange: onFileDialogChange
} = useFileDialog({
  multiple: true
});

const state: State = reactive({
  files: props.initialFiles ? (props.initialFiles as MemoFile[]) : [],
  content: props.initialContent || null,
  memoVisibility: MEMO_VISIBILITY.PRIVATE,
  selectedTags: [...(props.initialTags || [])],
  tagMenuExpanded: true,
  loading: false
});

const resetMemoForm = () => {
  state.content = null;
  state.selectedTags = [];
  state.files = [];
  if (memoForm.value) {
    memoForm.value?.resetForm();
  }
  resetFileDialog();
};

const handleAction = (action: string) => {
  switch (action) {
    case MEMO_ADDITIONAL_ACTIONS.ADD_CODE_BLOCK:
      if (state.content) {
        state.content += `\n${DEFAULT_CODE_BLOCK}`;
      } else {
        state.content = DEFAULT_CODE_BLOCK;
      }
      break;
    case MEMO_ADDITIONAL_ACTIONS.ADD_CHECKLIST:
      if (state.content) {
        state.content += `\n${DEFAULT_CHECK_LIST}`;
      } else {
        state.content = DEFAULT_CHECK_LIST;
      }
      break;
    case MEMO_ADDITIONAL_ACTIONS.PREVIEW:
      memoStore.setPreviewMemo({
        content: state.content || "",
        id: -1,
        createdAt: new Date().toISOString(),
        pinned: false,
        archived: false,
        userId: "",
        tags: state.selectedTags,
        files: state.files as File[],
        private: false,
        updatedAt: new Date().toISOString()
      });
      memoStore.previewDialog = true;
      break;
  }
};

const saveMemo = async () => {
  if (!memoForm.value || !(await memoForm.value.validate()).valid) {
    return;
  }
  try {
    state.loading = true;
    const content = state.content || i18n.t("noContent");
    if (memoStore.activeMemo) {
      await memoStore.editMemo(content, state.selectedTags, state.files);
    } else {
      await memoStore.saveMemo(content, state.selectedTags, state.files as File[]);
    }
    resetMemoForm();
  } finally {
    state.loading = false;
  }
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

const addReference = () => {
  const reference =
    "[Plenky](https://vlada.gov.hr/UserDocsImages//00%20Foto%20mobitel/Europski%20semestar/%C4%8Clanovi%20Vlade/5%20%C4%8Clanovi%20Vlade%20-%2015%20Vlada%20RH/Plenkovi%C4%87.jpg)";
  if (state.content) {
    state.content += `\n${reference}`;
  } else {
    state.content = reference;
  }
};

const removeFile = (idx: number) => {
  state.files = state.files.filter((f, i) => i !== idx) as File[];
};

const interactionDisabled = computed(() => props.disabled || props.readonly || state.loading);

onFileDialogChange(async (files) => {
  if (files) {
    for (let i = 0; i < files.length; i++) {
      if (files[i].size < MAX_FILE_SIZE) {
        (state.files as File[]).push(files[i]);
      } else {
        alert({
          text: "File too big! (Max 10MB)",
          type: "error"
        });
      }
    }
    resetFileDialog();
  }
});
</script>
