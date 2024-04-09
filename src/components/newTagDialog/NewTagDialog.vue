<template>
  <v-dialog
    class="d-flex flex-column align-center"
    :fullscreen="smAndDown"
    width="450"
    persistent
    :model-value="memoStore.tagDialog"
  >
    <v-card>
      <v-card-title class="d-flex items-center align-center pt-4 px-6">
        <span> {{ i18n.t("tags") }} </span>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          :color="theme.current.value.dark ? 'white' : 'black'"
          @click="close"
        />
      </v-card-title>
      <v-card-text class="pt-0 align-content-end">
        <vv-form
          ref="tagForm"
          as="v-form"
          @submit="saveTag"
        >
          <vv-field
            v-slot="{ field, errors }"
            v-model="state.tagContent"
            name="username"
            :rules="`required|min:3|must_not_be_in_array:${tagNames}`"
            label="Tag name"
          >
            <v-text-field
              v-model="state.tagContent"
              v-bind="field"
              density="compact"
              :placeholder="i18n.t('tagName')"
              hide-details="auto"
              :error-messages="errors"
            >
              <template #prepend>
                <v-btn
                  icon
                  density="compact"
                  variant="text"
                >
                  <v-icon :color="state.tagColor || 'grey'"> mdi-circle </v-icon>
                  <v-menu
                    :close-on-content-click="false"
                    activator="parent"
                  >
                    <v-color-picker
                      v-model="state.tagColor"
                      hide-inputs
                    />
                  </v-menu>
                </v-btn>
              </template>
              <template #append>
                <v-btn
                  density="compact"
                  variant="text"
                  color="blue-lighten-1"
                  icon="mdi-content-save"
                  @click="saveTag"
                />
              </template>
            </v-text-field>
          </vv-field>
        </vv-form>
      </v-card-text>
      <v-card-text class="pt-2 pb-4">
        <span class="text-grey text-subtitle-2"> {{ i18n.t("allTags") }} </span>
        <div
          class="d-flex flex-wrap flex-gap mt-2"
          v-if="memoStore.tags.length"
        >
          <v-chip
            density="compact"
            :color="tag.color"
            v-for="tag in memoStore.tags"
            :key="tag.id"
            closable
            @click:close="deleteTag(tag.id)"
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
        </div>
        <div
          class="text-grey text-subtitle-1 mt-2"
          v-else
        >
          {{ i18n.t("noTagsFound") }} 🙀
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { IVuetifyForm } from "@/models/common";
import { useMemoStore } from "@/store/memos";
import { computed, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useDisplay, useTheme } from "vuetify";

interface State {
  tagContent: string | null;
  tagColor: string | null;
}

const tagForm = ref<IVuetifyForm | null>(null);

const theme = useTheme();
const memoStore = useMemoStore();
const i18n = useI18n();
const { smAndDown } = useDisplay();

const state: State = reactive({
  tagContent: null,
  tagColor: null
});

const close = () => {
  memoStore.closeTagDialog();
};

const resetTagForm = () => {
  state.tagContent = null;
  state.tagColor = null;
  if (tagForm.value) {
    tagForm.value?.resetForm();
  }
};

const saveTag = async () => {
  if (!tagForm.value || !(await tagForm.value.validate()).valid) {
    return;
  }
  await memoStore.saveTag(state.tagContent || "", state.tagColor || "");
};

const deleteTag = async (id: number) => {
  await memoStore.deleteTag(id);
};

const tagNames = computed(() => {
  return memoStore.tags.map((t) => t.content);
});

watch(
  () => memoStore.tags,
  (newVal, oldVal) => {
    // Poruka budućem sebi: ovo sam stavio ovdje jer je race condition za validiranje
    // čudan pa detektira da tag postoji u vee - validate pa resetiranje
    // ne radimo unutar poziva za stvaranje već naknadno
    if (newVal.length > oldVal.length) resetTagForm();
  },
  {
    deep: true
  }
);
</script>

<style scoped lang="scss">
:deep(.v-color-picker-preview__alpha) {
  display: none !important;
}
</style>
