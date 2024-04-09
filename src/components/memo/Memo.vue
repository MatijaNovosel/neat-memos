<template>
  <v-card
    :loading="state.loading"
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
    <v-card-text class="pt-2">
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
          :closable="!props.readonly"
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
          {{ file.name }}
        </v-chip>
      </v-card-text>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import MarkdownRenderer from "@/components/markdownRenderer/MarkdownRenderer.vue";
import { useConfirmationDialog } from "@/composables/useConfirmationDialog";
import { useNotifications } from "@/composables/useNotifications";
import { MEMO_ACTIONS, memoActionItems } from "@/constants/memo";
import { downloadFileFromUrl } from "@/helpers/file";
import { capitalize } from "@/helpers/string";
import { MemoFile, MemoModel } from "@/models/memo";
import ROUTE_NAMES from "@/router/routeNames";
import { useMemoStore } from "@/store/memos";
import { format, formatRelative, isToday } from "date-fns";
import { computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { useTheme } from "vuetify";

interface Props {
  data: MemoModel;
  readonly?: boolean;
}

interface State {
  loading: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false
});

const memoStore = useMemoStore();
const theme = useTheme();
const router = useRouter();
const { alert } = useNotifications();
const createConfirmationDialog = useConfirmationDialog();

const state: State = reactive({
  loading: false
});

const handleAction = async (action: string) => {
  state.loading = true;
  switch (action) {
    case MEMO_ACTIONS.DELETE:
      const answer = await createConfirmationDialog();
      if (answer) {
        await memoStore.deleteMemo(props.data.id);
      }
      break;
    case MEMO_ACTIONS.PIN:
      await memoStore.pinMemo(props.data.id);
      break;
    case MEMO_ACTIONS.EDIT:
      memoStore.setActiveMemo(props.data);
      memoStore.openEditDialog();
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
  state.loading = false;
};

const dateFormatFn = (date: Date) => {
  if (isToday(date)) {
    return capitalize(formatRelative(date, new Date()));
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

const downloadFile = (file: File | MemoFile) => {
  if ("id" in file) downloadFileFromUrl(file.url, file.name);
  // else downloadFile(file);
};

const deleteFile = async (file: File | MemoFile) => {
  if ("id" in file) await memoStore.deleteFile(props.data.id, file.id);
};
</script>
