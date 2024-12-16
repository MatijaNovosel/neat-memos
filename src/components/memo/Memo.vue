<template>
  <v-card
    :loading="loading"
    flat
    :color="theme.current.value.dark ? '' : 'white'"
  >
    <div class="d-flex justify-space-between align-center px-5 pt-3 text-grey font-weight-regular">
      <div class="d-flex align-center ml-n1">
        <div class="d-flex flex-column">
          <span class="d-flex align-center">
            <span class="text-subtitle-2">
              {{ createdAtFormatted }}
            </span>
            <template v-if="props.data.pinned">
              <span class="ml-2 mr-1"> • </span>
              <v-icon
                size="18"
                color="amber"
              >
                mdi-bookmark
              </v-icon>
            </template>
          </span>
          <span
            v-if="!sameDate"
            class="text-caption text-grey-lighten-1"
          >
            Updated {{ updatedAtFormatted }}
          </span>
        </div>
      </div>
      <v-btn
        variant="text"
        density="compact"
        icon
        :disabled="props.readonly"
        class="top-right"
        color="grey"
      >
        <v-icon> mdi-dots-vertical </v-icon>
        <v-menu
          width="120"
          activator="parent"
        >
          <v-list
            border
            elevation="0"
            density="compact"
            class="py-0"
          >
            <v-list-item
              class="text-caption py-0"
              @click="handleAction(item.type)"
              v-for="(item, i) in memoActionItems"
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
      </v-btn>
    </div>
    <v-card-text
      class="pt-2"
      :class="{
        dark: theme.current.value.dark
      }"
    >
      <markdown-renderer :source="props.data.content || 'No content'" />
    </v-card-text>
    <v-card-text
      class="pt-0 d-flex flex-gap"
      v-if="props.data.tags && props.data.tags.length"
    >
      <v-chip
        density="compact"
        :color="tag.color"
        v-for="tag in props.data.tags"
        :key="tag.id"
      >
        <v-icon
          class="mr-2"
          size="15"
          :color="tag.color"
        >
          mdi-pound
        </v-icon>
        <span> {{ tag.content }} </span>
      </v-chip>
    </v-card-text>
    <template v-if="props.data.files && props.data.files.length">
      <v-divider />
      <v-card-text class="d-flex flex-wrap flex-gap">
        <v-chip
          @click="downloadFile(file)"
          color="orange"
          :closable="!props.readonly && !props.data.archived"
          @click:close="deleteFile(file)"
          density="compact"
          v-for="(file, i) in props.data.files"
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
      </v-card-text>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import MarkdownRenderer from "@/components/markdownRenderer/MarkdownRenderer.vue";
import { useConfirmationDialog } from "@/composables/useConfirmationDialog";
import { useNotifications } from "@/composables/useNotifications";
import { MEMO_ACTIONS } from "@/constants/memo";
import { downloadFileFromUrl, fileSizeReadable } from "@/helpers/file";
import { capitalize } from "@/helpers/string";
import { MemoModel, ResourceFile } from "@/models/memo";
import ROUTE_NAMES from "@/router/routeNames";
import { useMemoStore } from "@/store/memos";
import { format, formatRelative, isToday } from "date-fns";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useTheme } from "vuetify";

interface Props {
  data: MemoModel;
  readonly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false
});

const memoStore = useMemoStore();
const theme = useTheme();
const router = useRouter();
const { alert } = useNotifications();
const createConfirmationDialog = useConfirmationDialog();

const loading = ref(false);

const i18n = useI18n();

const memoActionItems = computed(() => {
  const res = [
    {
      icon: "mdi-delete-outline",
      text: i18n.t("delete"),
      type: MEMO_ACTIONS.DELETE,
      color: "red"
    }
  ];

  if (!props.data.archived) {
    res.push(
      ...[
        {
          icon: "mdi-pin",
          text: i18n.t("pin"),
          type: MEMO_ACTIONS.PIN,
          color: "grey"
        },
        {
          icon: "mdi-pencil",
          text: i18n.t("edit"),
          type: MEMO_ACTIONS.EDIT,
          color: "grey"
        },
        {
          icon: "mdi-share",
          text: i18n.t("share"),
          type: MEMO_ACTIONS.SHARE,
          color: "grey"
        },
        {
          icon: "mdi-archive",
          text: "Archive",
          type: MEMO_ACTIONS.ARCHIVE,
          color: "grey"
        }
      ]
    );
  }

  return res;
});

const handleAction = async (action: string) => {
  loading.value = true;
  switch (action) {
    case MEMO_ACTIONS.DELETE:
      const answerDelete = await createConfirmationDialog();
      if (answerDelete) await memoStore.deleteMemo(props.data.id);
      break;
    case MEMO_ACTIONS.ARCHIVE:
      const answerArchive = await createConfirmationDialog();
      if (answerArchive) await memoStore.archiveMemo(props.data.id);
      break;
    case MEMO_ACTIONS.PIN:
      await memoStore.pinMemo(props.data.id);
      break;
    case MEMO_ACTIONS.EDIT:
      memoStore.activeMemo = Object.assign({}, props.data);
      memoStore.editDialog = true;
      break;
    case MEMO_ACTIONS.SHARE:
      if (props.data.private) {
        alert({
          text: "Cannot share, private memo!",
          type: "error"
        });
        return;
      }
      router.push({
        name: ROUTE_NAMES.MEMO,
        params: {
          id: props.data.id
        }
      });
      break;
  }
  loading.value = false;
};

const dateFormatFn = (date: Date) => {
  if (isToday(date)) {
    // formatRelative ima jako glupe opcije za lokaliziranje pa se držim ovog
    return capitalize(formatRelative(date, new Date()))!.replace("am", "");
  } else {
    return format(date, "dd.MM.yyyy. HH:mm");
  }
};

const sameDate = computed(() => {
  return new Date(props.data.createdAt).getTime() === new Date(props.data.updatedAt).getTime();
});

const createdAtFormatted = computed(() => {
  const date = new Date(props.data.createdAt);
  return dateFormatFn(date);
});

const updatedAtFormatted = computed(() => {
  const date = new Date(props.data.updatedAt);
  return dateFormatFn(date);
});

const downloadFile = (file: File | ResourceFile) => {
  if ("id" in file) downloadFileFromUrl(file.url, file.name);
  // else downloadFile(file);
};

const deleteFile = async (file: File | ResourceFile) => {
  if ("id" in file) await memoStore.deleteFile(props.data.id, file.id);
};
</script>
