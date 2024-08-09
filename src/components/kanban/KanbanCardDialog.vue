<template>
  <v-dialog
    class="d-flex flex-column align-center"
    :fullscreen="smAndDown"
    width="650"
    persistent
    :model-value="kanbanStore.kanbanCardDialog"
  >
    <v-card>
      <v-card-title
        class="d-flex items-center align-center pt-2 px-6"
        :style="titleStyle"
      >
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          class="bg-orange my-3"
          color="white"
          @click="close"
        />
      </v-card-title>
      <v-divider />
      <v-row
        no-gutters
        class="my-3"
      >
        <v-col
          cols="8"
          class="px-4 pb-4"
        >
          <v-text-field
            class="mb-3"
            hide-details
            v-model="state.title"
            placeholder="Title"
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
          class="d-flex flex-column flex-gap pr-3"
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
            v-if="!isNewCard"
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
        <template v-if="isNewCard">
          <v-divider />
          <v-col
            cols="12"
            class="d-flex justify-end pt-3 pr-3"
          >
            <v-btn
              color="green"
              rounded="8"
              variant="flat"
              @click="save"
            >
              Save
            </v-btn>
          </v-col>
        </template>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { useNotifications } from "@/composables/useNotifications";
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
const { alert } = useNotifications();

const state: State = reactive({
  title: "",
  description: "",
  coverColor: "#ffffff",
  tags: [],
  selectedTags: []
});

const isNewCard = computed(() => !kanbanStore.activeCard);

const close = () => {
  kanbanStore.kanbanCardDialog = false;
  setTimeout(() => {
    kanbanStore.activeCard = null;
    kanbanStore.activeColumnId = null;
    state.selectedTags = [];
    state.title = "";
    state.description = "";
    state.tags = [];
  }, 500);
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

const save = async () => {
  const project = kanbanStore.projects.find((p) => p.id === kanbanStore.selectedProject);
  const maxPosition = Math.max(
    ...project!.columns
      .find((c) => c.id === kanbanStore.activeColumnId)!
      .cards.map((c) => c.position)
  );
  console.log(maxPosition);
  console.log(project!.columns.find((c) => c.id === kanbanStore.activeColumnId)!.cards);
  await kanbanStore.createCard({
    columnId: kanbanStore.activeColumnId!,
    coverColor: state.coverColor === "#ffffff" ? null : state.coverColor,
    coverUrl: null,
    description: state.description,
    title: state.title,
    tags: [],
    position: maxPosition + 1,
    projectId: kanbanStore.selectedProject!
  });
  close();
  alert({
    text: "Card created"
  });
};

const availableTags = computed(() => {
  const tagIds = state.tags.map((t) => t.id);
  return memoStore.tags.filter((t) => !tagIds.includes(t.id));
});

const titleStyle = computed(() => {
  if (kanbanStore.activeCard) {
    const styleObj: any = {};

    if (kanbanStore.activeCard.coverColor) {
      styleObj.backgroundColor = kanbanStore.activeCard.coverColor;
    }

    if (kanbanStore.activeCard.coverUrl) {
      styleObj.background = `url(${kanbanStore.activeCard.coverUrl})`;
      styleObj.height = "170px";
      styleObj.backgroundSize = "cover";
      styleObj.backgroundPosition = "center";
    }

    return styleObj;
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
