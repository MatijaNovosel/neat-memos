<template>
  <v-dialog
    class="d-flex flex-column align-center"
    :fullscreen="smAndDown"
    width="650"
    persistent
    :model-value="kanbanStore.detailsDialog"
  >
    <v-card v-if="kanbanStore.activeCard">
      <v-card-title class="d-flex items-center align-center pt-2 px-6">
        <v-text-field
          hide-details
          v-model="state.title"
          density="compact"
        />
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="close"
        />
      </v-card-title>
      <v-divider />
      <v-row
        no-gutters
        class="mt-3 pr-3"
      >
        <v-col
          cols="8"
          class="px-4 pb-4"
        >
          <div class="text-grey-lighten-1 text-subtitle-2">Labels</div>
          <div class="d-flex flex-gap flex-wrap align-center">
            <v-chip
              size="small"
              color="red"
            >
              Media
            </v-chip>
            <v-chip
              size="small"
              color="orange"
            >
              Todo
            </v-chip>
            <v-chip
              size="small"
              color="blue"
            >
              Movies
            </v-chip>
            <v-btn
              icon
              height="26px"
              width="26px"
              variant="tonal"
              size="small"
              color="grey"
              rounded="0"
            >
              <v-icon> mdi-plus </v-icon>
              <v-menu activator="parent">
                <v-card
                  rounded="8"
                  width="400"
                  flat
                >
                  <v-card-text class="d-flex flex-wrap flex-gap">
                    <template v-if="memoStore.tags.length">
                      <v-chip
                        density="compact"
                        :color="tag.color"
                        v-for="tag in memoStore.tags"
                        :key="tag.id"
                      >
                        <span> {{ tag.content }} </span>
                      </v-chip>
                    </template>
                    <div
                      class="text-grey text-subtitle-2"
                      v-else
                    >
                      {{ i18n.t("noTagsFound") }}
                    </div>
                  </v-card-text>
                  <v-divider />
                  <v-card-actions class="justify-end">
                    <v-btn
                      size="small"
                      color="green"
                      rounded="8"
                    >
                      New label
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </v-btn>
          </div>
          <div class="text-grey-lighten-1 text-subtitle-2 mt-3">Description</div>
          <v-textarea
            class="mt-2"
            auto-grow
            hide-details="auto"
            row-height="15"
            rows="3"
            v-model="state.description"
            placeholder="Description"
          />
        </v-col>
        <v-col
          cols="4"
          class="d-flex flex-column flex-gap"
        >
          <v-btn
            size="small"
            color="orange"
            rounded="8"
            variant="tonal"
            prepend-icon="mdi-credit-card"
            text="Cover"
          />
          <v-btn
            size="small"
            color="blue"
            rounded="8"
            variant="tonal"
            prepend-icon="mdi-tag"
            text="Labels"
          />
          <v-btn
            size="small"
            color="green"
            rounded="8"
            prepend-icon="mdi-card-multiple-outline"
            variant="tonal"
            text="Copy"
          />
          <v-btn
            size="small"
            color="purple"
            rounded="8"
            variant="tonal"
            prepend-icon="mdi-paperclip"
            text="Attachment"
          />
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { useKanbanStore } from "@/store/kanban";
import { useMemoStore } from "@/store/memos";
import { reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";

interface State {
  title: string;
  description: string;
}

const { smAndDown } = useDisplay();
const i18n = useI18n();
const memoStore = useMemoStore();
const kanbanStore = useKanbanStore();

const state: State = reactive({
  title: "",
  description: ""
});

const close = () => {
  kanbanStore.detailsDialog = false;
};

watch(
  () => kanbanStore.activeCard,
  (val) => {
    console.log(val);
    state.title = val?.name || "";
  }
);
</script>
