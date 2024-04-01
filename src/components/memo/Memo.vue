<template>
  <v-card
    flat
    :color="theme.current.value.dark ? '' : 'white'"
  >
    <div
      class="d-flex justify-space-between align-center px-5 pt-3 text-subtitle-2 text-grey font-weight-regular"
    >
      <div class="d-flex align-center ml-n1">
        <span> {{ createdAtFormatted }} </span>
        <template v-if="props.data.pinned">
          <span class="ml-2 mr-1"> • </span>
          <v-icon color="amber"> mdi-bookmark-outline </v-icon>
        </template>
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
      <markdown-renderer :source="props.data.content" />
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
  </v-card>
</template>

<script setup lang="ts">
import MarkdownRenderer from "@/components/markdownRenderer/MarkdownRenderer.vue";
import { useConfirmationDialog } from "@/composables/useConfirmationDialog";
import { MEMO_ACTIONS, memoActionItems } from "@/constants/memo";
import { capitalize } from "@/helpers/string";
import { MemoModel } from "@/models/memo";
import { useMemoStore } from "@/store/memos";
import { format, formatRelative, isToday } from "date-fns";
import { computed } from "vue";
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
const createConfirmationDialog = useConfirmationDialog();

const handleAction = async (action: string) => {
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
  }
};

const createdAtFormatted = computed(() => {
  const date = new Date(props.data.createdAt);
  if (isToday(date)) {
    return capitalize(formatRelative(date, new Date()));
  } else {
    return format(date, "dd.MM.yyyy. HH:mm");
  }
});
</script>
