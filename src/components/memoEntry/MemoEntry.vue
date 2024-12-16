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
        v-model="content"
        name="content"
        rules="required|max:2048|min:3"
        :label="i18n.t('content')"
      >
        <v-textarea
          :readonly="props.readonly || loading"
          auto-grow
          v-bind="field"
          hide-details="auto"
          :error-messages="errors"
          row-height="15"
          rows="1"
          variant="plain"
          v-model="content"
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
          @click="tagMenuExpanded = !tagMenuExpanded"
          :color="tagMenuExpanded ? 'orange' : 'grey'"
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
          v-if="tagMenuExpanded"
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
        v-if="files.length"
      >
        <v-chip
          :disabled="interactionDisabled"
          color="orange"
          density="compact"
          @click="removeFile(i)"
          v-for="(file, i) in files"
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
            v-model="memoVisibility"
            class="mr-5 flex-shrink"
          />
        </v-col>
        <v-col cols="4" />
        <v-col
          cols="4"
          class="d-flex justify-end"
        >
          <v-btn
            :disabled="interactionDisabled"
            rounded="lg"
            :color="interactionDisabled ? 'grey' : 'orange'"
            type="submit"
            :loading="loading"
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
import { ResourceFile } from "@/models/resources";
import { TagModel } from "@/models/tag";
import { useMemoStore } from "@/store/memos";
import { useFileDialog } from "@vueuse/core";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useTheme } from "vuetify";

interface Props {
  initialContent?: string | null;
  initialTags?: TagModel[];
  initialFiles?: ResourceFile[];
  readonly?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  disabled: false
});

const theme = useTheme();

const memoForm = ref<IForm>();

const memoStore = useMemoStore();
const i18n = useI18n();
const { alert } = useNotifications();

const loading = ref(false);
const tagMenuExpanded = ref(true);
const content = ref<string>(props.initialContent || "");
const memoVisibility = ref<number>(MEMO_VISIBILITY.PRIVATE);
const selectedTags = ref<TagModel[]>([...(props.initialTags || [])]);
const files = ref<Array<ResourceFile | File>>(
  props.initialFiles ? (props.initialFiles as ResourceFile[]) : []
);

const {
  open: openImageDialog,
  reset: resetFileDialog,
  onChange: onFileDialogChange
} = useFileDialog({
  multiple: true
});

const resetMemoForm = () => {
  content.value = "";
  selectedTags.value = [];
  files.value = [];
  if (memoForm.value) {
    memoForm.value?.resetForm();
  }
  resetFileDialog();
};

const handleAction = (action: string) => {
  switch (action) {
    case MEMO_ADDITIONAL_ACTIONS.ADD_CODE_BLOCK:
      if (content.value.length) {
        content.value += `\n${DEFAULT_CODE_BLOCK}`;
      } else {
        content.value = DEFAULT_CODE_BLOCK;
      }
      break;
    case MEMO_ADDITIONAL_ACTIONS.ADD_CHECKLIST:
      if (content.value.length) {
        content.value += `\n${DEFAULT_CHECK_LIST}`;
      } else {
        content.value = DEFAULT_CHECK_LIST;
      }
      break;
    case MEMO_ADDITIONAL_ACTIONS.PREVIEW:
      memoStore.setPreviewMemo({
        content: content.value,
        id: -1,
        createdAt: new Date().toISOString(),
        pinned: false,
        archived: false,
        userId: "",
        tags: selectedTags.value,
        files: files.value as File[],
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
    loading.value = true;
    if (memoStore.activeMemo) {
      await memoStore.editMemo(content.value, selectedTags.value, files.value);
    } else {
      await memoStore.saveMemo(content.value, selectedTags.value, files.value as File[]);
    }
    resetMemoForm();
  } finally {
    loading.value = false;
  }
};

const isInSelectedTags = (tagId: number) => {
  return !!selectedTags.value.find((t) => t.id === tagId);
};

const addToSelectedTags = (tag: TagModel) => {
  if (!!selectedTags.value.find((t) => t.id === tag.id)) {
    selectedTags.value = selectedTags.value.filter((t) => t.id !== tag.id);
    return;
  }
  selectedTags.value.push(tag);
};

const addReference = () => {
  const reference =
    "[Plenky](https://vlada.gov.hr/UserDocsImages//00%20Foto%20mobitel/Europski%20semestar/%C4%8Clanovi%20Vlade/5%20%C4%8Clanovi%20Vlade%20-%2015%20Vlada%20RH/Plenkovi%C4%87.jpg)";
  if (content.value.length) {
    content.value += `\n${reference}`;
  } else {
    content.value = reference;
  }
};

const removeFile = (idx: number) => {
  files.value = files.value.filter((f, i) => i !== idx) as File[];
};

const interactionDisabled = computed(() => props.disabled || props.readonly || loading.value);

onFileDialogChange(async (selectedFiles) => {
  if (selectedFiles) {
    for (let i = 0; i < selectedFiles.length; i++) {
      if (selectedFiles[i].size < MAX_FILE_SIZE) {
        (files.value as File[]).push(selectedFiles[i]);
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
