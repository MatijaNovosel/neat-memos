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
        <v-text-field
          hide-details
          density="compact"
          placeholder="Tag name"
          append-inner-icon="mdi-check-circle"
          @click:append-inner="saveTag"
        />
      </v-card-text>
      <v-card-text class="pt-2 pb-4">
        <span class="text-grey text-subtitle-2"> All tags </span>
        <div class="d-flex flex-gap mt-2">
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
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useMemoStore } from "@/store/memos";
import { useDisplay } from "vuetify";

const memoStore = useMemoStore();
const { smAndDown } = useDisplay();

const close = () => {
  memoStore.closeTagDialog();
};

const saveTag = () => {
  //
};

const deleteTag = (id: number) => {
  //
};
</script>
