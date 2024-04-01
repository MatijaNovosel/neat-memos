<template>
  <v-dialog
    :fullscreen="smAndDown"
    width="450"
    persistent
    :model-value="memoStore.tagDialog"
  >
    <v-card>
      <v-card-title class="d-flex items-center align-center pt-4 px-6">
        <span> Tags </span>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          color="black"
          @click="close"
        />
      </v-card-title>
      <v-card-text class="pt-0">
        <vv-form
          ref="tagForm"
          as="v-form"
          @submit="saveTag"
        >
          <vv-field
            v-slot="{ field, errors }"
            v-model="state.tagContent"
            name="username"
            rules="required"
            label="Tag name"
          >
            <v-text-field
              v-model="state.tagContent"
              v-bind="field"
              density="compact"
              placeholder="Tag name"
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
        <span class="text-grey text-subtitle-2"> All tags </span>
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
          No tags found! 🙀
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { IVuetifyForm } from "@/models/common";
import { useMemoStore } from "@/store/memos";
import { reactive, ref } from "vue";
import { useDisplay } from "vuetify";

interface State {
  tagContent: string | null;
  tagColor: string | null;
}

const tagForm = ref<IVuetifyForm | null>(null);

const memoStore = useMemoStore();
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
  resetTagForm();
};

const deleteTag = async (id: number) => {
  await memoStore.deleteTag(id);
};
</script>
