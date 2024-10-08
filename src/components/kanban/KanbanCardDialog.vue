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
          :loading="saving"
          :disabled="saving"
          variant="text"
          size="small"
          class="my-3"
          :class="{
            'bg-orange': !saving,
            'bg-grey': saving
          }"
          color="white"
          @click="close"
        />
      </v-card-title>
      <vv-form
        ref="cardForm"
        as="v-form"
        @submit="() => save()"
      >
        <v-row
          no-gutters
          class="my-3"
        >
          <v-col
            cols="8"
            class="px-4 pb-4"
          >
            <vv-field
              v-slot="{ field, errors }"
              v-model="title"
              name="cardName"
              rules="required|min:3"
              label="Name"
            >
              <v-text-field
                v-bind="field"
                class="mb-1"
                hide-details="auto"
                :error-messages="errors"
                v-model="title"
                placeholder="Title"
                density="compact"
              />
            </vv-field>
            <div
              v-if="!isNewCard"
              class="text-grey text-caption"
            >
              <span class="ml-1"> Created </span>
              {{ format(new Date(kanbanStore.activeCard!.createdAt), "dd.MM.yyyy. HH:mm") }}
            </div>
            <div class="text-grey-lighten-1 text-subtitle-2 mt-2">Tags</div>
            <div class="d-flex flex-gap flex-wrap align-center mt-2">
              <template v-if="tags.length">
                <v-chip
                  v-for="tag in tags"
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
                  v-model="cardMenu"
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
              v-model="description"
              placeholder="Description"
            />
          </v-col>
          <v-col
            cols="4"
            class="d-flex flex-column flex-gap pr-3"
          >
            <div class="d-flex items-center align-center">
              <v-btn
                size="small"
                color="orange"
                rounded="8"
                variant="tonal"
                class="flex-grow-1"
              >
                <v-icon class="mr-2"> mdi-credit-card </v-icon>
                <span> Cover </span>
                <v-menu
                  :close-on-content-click="false"
                  activator="parent"
                >
                  <v-card
                    rounded="8"
                    class="pa-3 d-flex flex-column align-center"
                    flat
                  >
                    <div class="text-grey-lighten-1 text-subtitle-2 w-100 mb-2">Color</div>
                    <v-color-picker
                      hide-inputs
                      show-swatches
                      :swatches="colorSwatches"
                      v-model="coverColor"
                      @update:modelValue="updateCoverColor"
                      class="elevation-0 pa-0"
                    />
                    <v-btn
                      class="w-fit-content"
                      color="orange-darken-1"
                      size="small"
                      @click="clearCover"
                      rounded="4"
                      variant="flat"
                    >
                      Clear
                    </v-btn>
                  </v-card>
                </v-menu>
              </v-btn>
              <v-btn
                color="orange"
                variant="text"
                density="compact"
                icon="mdi-close-circle"
                class="ml-2 mr-1"
                @click="clearCover"
              />
            </div>
            <v-btn
              v-if="!isNewCard"
              size="small"
              :loading="saving"
              color="green"
              rounded="8"
              prepend-icon="mdi-card-multiple-outline"
              variant="tonal"
              text="Copy"
              @click="copyCard"
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
                type="submit"
                variant="flat"
                @click="save"
              >
                Save
              </v-btn>
            </v-col>
          </template>
        </v-row>
      </vv-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { useNotifications } from "@/composables/useNotifications";
import { colorSwatches } from "@/constants/kanban";
import { IForm } from "@/models/common";
import { TagModel } from "@/models/tag";
import { useKanbanStore } from "@/store/kanban";
import { useMemoStore } from "@/store/memos";
import { useDebounceFn } from "@vueuse/core";
import { format } from "date-fns";
import type { CSSProperties } from "vue";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";

const { smAndDown } = useDisplay();
const i18n = useI18n();
const memoStore = useMemoStore();
const kanbanStore = useKanbanStore();
const { alert } = useNotifications();

const title = ref("");
const coverColor = ref<string | null>(null);
const description = ref("");
const cardMenu = ref(false);
const saving = ref(false);
const cardForm = ref<IForm | null>(null);

const tags = ref<TagModel[]>([]);
const selectedTags = ref<TagModel[]>([]);

const isNewCard = computed(() => !kanbanStore.activeCard);

const close = () => {
  kanbanStore.kanbanCardDialog = false;
  setTimeout(() => {
    kanbanStore.activeCard = null;
    kanbanStore.activeColumnId = null;
    selectedTags.value = [];
    title.value = "";
    description.value = "";
    tags.value = [];
    coverColor.value = null;
    cardForm.value?.resetForm();
  }, 300);
};

const selectTag = (tag: TagModel) => {
  if (!!selectedTags.value.find((t) => t.id === tag.id)) {
    selectedTags.value = selectedTags.value.filter((t) => t.id !== tag.id);
    return;
  }
  selectedTags.value.push(tag);
};

const isInSelectedTags = (tagId: number) => {
  return !!selectedTags.value.find((t) => t.id === tagId);
};

const saveTags = () => {
  tags.value = [...tags.value, ...selectedTags.value];
  selectedTags.value = [];
  cardMenu.value = false;
  if (!isNewCard.value) {
    save();
  }
};

const deleteTag = (tagId: number) => {
  tags.value = tags.value.filter((t) => t.id !== tagId);
  if (!isNewCard.value) {
    save();
  }
};

const save = useDebounceFn(async (copy: boolean = false) => {
  saving.value = true;
  const project = kanbanStore.projects.find((p) => p.id === kanbanStore.selectedProject);

  if (!isNewCard.value && copy === true) {
    const maxPosition = Math.max(
      ...project!.columns
        .find((c) => c.id === kanbanStore.activeCard!.columnId)!
        .cards.map((c) => c.position)
    );
    await kanbanStore.createCard({
      columnId: kanbanStore.activeCard!.columnId,
      coverColor: coverColor.value === "#ffffff" ? null : coverColor.value,
      coverUrl: null,
      description: description.value,
      name: title.value,
      tags: tags.value,
      position: maxPosition + 1,
      projectId: kanbanStore.selectedProject!
    });
  } else if (!isNewCard.value) {
    await kanbanStore.editKanbanCard({
      id: kanbanStore.activeCard!.id,
      coverColor: coverColor.value === "#ffffff" || !coverColor.value ? null : coverColor.value,
      coverUrl: null,
      name: title.value,
      description: description.value,
      initialTags: kanbanStore.activeCard!.tags,
      tags: tags.value
    });
    const column = project?.columns.find((c) => c.id === kanbanStore.activeCard?.columnId);
    const card = column!.cards.find((card) => card.id === kanbanStore.activeCard?.id);
    card!.name = title.value;
    card!.description = description.value;
    card!.coverColor =
      coverColor.value === "#ffffff" || !coverColor.value ? null : coverColor.value;
    card!.tags = tags.value;
    kanbanStore.activeCard!.tags = tags.value;
  } else {
    if (!cardForm.value || !(await cardForm.value.validate()).valid) {
      saving.value = false;
      return;
    }
    const maxPosition = Math.max(
      ...project!.columns
        .find((c) => c.id === kanbanStore.activeColumnId)!
        .cards.map((c) => c.position)
    );
    await kanbanStore.createCard({
      columnId: kanbanStore.activeColumnId!,
      coverColor: coverColor.value === "#ffffff" ? null : coverColor.value,
      coverUrl: null,
      description: description.value,
      name: title.value,
      tags: tags.value,
      position: maxPosition + 1,
      projectId: kanbanStore.selectedProject!
    });
    close();
    alert({
      text: "Card created"
    });
  }
  saving.value = false;
}, 500);

const updateCoverColor = async (value: string | null) => {
  coverColor.value = value;
  if (!isNewCard.value) {
    await save();
  }
};

const availableTags = computed(() => {
  const tagIds = tags.value.map((t) => t.id);
  return memoStore.tags.filter((t) => !tagIds.includes(t.id));
});

const titleStyle = computed(() => {
  const styleObj: CSSProperties = {};

  styleObj.backgroundColor = coverColor.value || undefined;

  if (kanbanStore.activeCard?.coverUrl) {
    styleObj.background = `url(${kanbanStore.activeCard.coverUrl})`;
    styleObj.height = "170px";
    styleObj.backgroundSize = "cover";
    styleObj.backgroundPosition = "center";
  }

  return styleObj;
});

const clearCover = () => {
  coverColor.value = null;
  if (!isNewCard.value) {
    save();
  }
};

const copyCard = () => {
  save(true);
};

watch(title, (newVal, oldVal) => {
  if (oldVal !== newVal && newVal.length !== 0 && oldVal.length !== 0 && !isNewCard.value) {
    save();
  }
});

watch(description, (newVal, oldVal) => {
  if (oldVal !== newVal && newVal.length !== 0 && oldVal.length !== 0 && !isNewCard.value) {
    save();
  }
});

watch(
  () => kanbanStore.activeCard,
  (val) => {
    title.value = val?.name || "";
    description.value = val?.description || "";
    coverColor.value = val?.coverColor || "#ffffff";
    tags.value = val?.tags || [];
  }
);
</script>
