<template>
  <v-dialog
    class="d-flex flex-column align-center"
    :fullscreen="smAndDown"
    width="650"
    persistent
    :model-value="kanbanStore.detailsDialog"
  >
    <v-card v-if="kanbanStore.activeCard">
      <v-card-title
        class="d-flex items-center align-center pt-2 px-6"
        :style="titleStyle"
      >
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          color="black"
          @click="close"
        />
      </v-card-title>
      <v-divider />
      <v-row
        no-gutters
        class="my-3 pr-3"
      >
        <v-col
          cols="8"
          class="px-4 pb-4"
        >
          <v-text-field
            class="mb-3"
            hide-details
            v-model="state.title"
            density="compact"
          />
          <div class="text-grey-lighten-1 text-subtitle-2">Tags</div>
          <div class="d-flex flex-gap flex-wrap align-center mt-2">
            <template v-if="state.tags.length">
              <v-chip
                v-for="tag in state.tags"
                :key="tag.id"
                size="small"
                :color="tag.color"
                closable
                @click:close="deleteTag(tag.id)"
              >
                {{ tag.content }}
              </v-chip>
            </template>
            <span
              class="text-subtitle-2"
              v-else
            >
              No tags found
            </span>
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
              <v-menu
                :close-on-content-click="false"
                activator="parent"
              >
                <v-card
                  rounded="8"
                  width="400"
                  flat
                >
                  <v-card-text class="d-flex flex-wrap flex-gap">
                    <template v-if="availableTags.length">
                      <v-chip
                        density="compact"
                        v-for="tag in availableTags"
                        :key="tag.id"
                        :color="isInSelectedTags(tag.id) ? tag.color : 'grey'"
                        @click="selectTag(tag)"
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
                      variant="tonal"
                      color="green"
                      density="compact"
                      rounded="8"
                      @click="saveTags"
                    >
                      Save
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
          >
            <v-icon class="mr-2"> mdi-credit-card </v-icon>
            <span> Cover </span>
            <v-menu
              :close-on-content-click="false"
              activator="parent"
            >
              <v-card
                rounded="8"
                class="pa-3 d-flex flex-column"
                flat
              >
                <div class="text-grey-lighten-1 text-subtitle-2 w-100 mb-2">Color</div>
                <v-color-picker
                  hide-inputs
                  hide-sliders
                  v-model="state.coverColor"
                  class="elevation-0 pa-0"
                />
              </v-card>
            </v-menu>
          </v-btn>
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
import { TagModel } from "@/models/tag";
import { useKanbanStore } from "@/store/kanban";
import { useMemoStore } from "@/store/memos";
import { computed, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";

interface State {
  title: string;
  description: string;
  coverColor: string;
  tags: TagModel[];
  selectedTags: TagModel[];
}

const { smAndDown } = useDisplay();
const i18n = useI18n();
const memoStore = useMemoStore();
const kanbanStore = useKanbanStore();

const state: State = reactive({
  title: "",
  description: "",
  coverColor: "#ffffff",
  tags: [],
  selectedTags: []
});

const close = () => {
  kanbanStore.detailsDialog = false;
  state.selectedTags = [];
  state.title = "";
  state.description = "";
  state.tags = [];
};

const selectTag = (tag: TagModel) => {
  if (!!state.selectedTags.find((t) => t.id === tag.id)) {
    state.selectedTags = state.selectedTags.filter((t) => t.id !== tag.id);
    return;
  }
  state.selectedTags.push(tag);
};

const isInSelectedTags = (tagId: number) => {
  return !!state.selectedTags.find((t) => t.id === tagId);
};

const saveTags = () => {
  state.tags.push(...state.selectedTags);
  state.selectedTags = [];
};

const deleteTag = (tagId: number) => {
  state.tags = state.tags.filter((t) => t.id !== tagId);
};

const availableTags = computed(() => {
  const tagIds = state.tags.map((t) => t.id);
  return memoStore.tags.filter((t) => !tagIds.includes(t.id));
});

const titleStyle = computed(() => {
  if (kanbanStore.activeCard) {
    return {
      backgroundColor: kanbanStore.activeCard.coverColor
        ? kanbanStore.activeCard.coverColor
        : undefined
    };
  }
});

watch(
  () => kanbanStore.activeCard,
  (val) => {
    console.log(val);
    state.title = val?.name || "";
    state.description = val?.description || "";
    state.coverColor = val?.coverColor || "#ffffff";
    state.tags = val?.tags || [];
  }
);
</script>
