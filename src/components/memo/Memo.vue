<template>
  <v-card
    flat
    color="white"
  >
    <div
      class="d-flex justify-space-between align-center px-5 pt-3 text-subtitle-2 text-grey font-weight-regular"
    >
      <div class="d-flex align-center">
        <span> {{ createdAtFormatted }} </span>
        <template v-if="props.data.pinned">
          <span class="ml-2 mr-1"> • </span>
          <v-icon color="amber"> mdi-bookmark </v-icon>
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
  </v-card>
</template>

<script setup lang="ts">
import MarkdownRenderer from "@/components/markdownRenderer/MarkdownRenderer.vue";
import { MemoModel } from "@/models/memo";
import { useMemoStore } from "@/store/memos";
import { formatRelative, format, isToday } from "date-fns";
import { computed } from "vue";
import { capitalize } from "@/helpers/string";
import { memoActionItems, MEMO_ACTIONS } from "@/constants/memo";
import { useNotifications } from "@/composables/useNotifications";
import { useConfirmationDialog } from "@/composables/useConfirmationDialog";

interface Props {
  data: MemoModel;
  readonly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false
});

const memoStore = useMemoStore();
const { alert } = useNotifications();
const createConfirmationDialog = useConfirmationDialog();

const handleAction = async (action: string) => {
  switch (action) {
    case MEMO_ACTIONS.DELETE:
      const answer = await createConfirmationDialog();
      if (answer) {
        await memoStore.deleteMemo(props.data.id);
        alert({
          text: "Memo deleted!"
        });
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
    return format(date, "dd.MM.yyyy. hh:mm");
  }
});
</script>
