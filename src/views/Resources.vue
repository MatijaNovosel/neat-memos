<template>
  <v-container class="main-ctr">
    <v-row v-if="state.loading">
      <v-progress-circular
        class="my-6 mx-auto"
        color="orange"
        size="50"
        indeterminate
      />
    </v-row>
    <v-row
      class="mt-10 d-flex flex-column align-center"
      v-if="!state.files.length && !state.loading"
    >
      <span class="text-h1 mb-5"> 😿 </span>
      <span class="text-h6"> {{ i18n.t("noDataFound") }}. </span>
    </v-row>
    <v-row v-if="!state.loading && state.files.length">
      <v-col
        cols="12"
        v-for="(group, i) in Object.keys(groupedFiles)"
        :key="i"
      >
        <v-chip
          class="mb-3"
          size="small"
          density="compact"
          color="orange"
        >
          {{ group }}
        </v-chip>
        <v-row>
          <v-col
            cols="12"
            md="4"
            v-for="(file, j) in groupedFiles[group]"
            :key="j"
          >
            <v-card
              flat
              border
              class="pt-3"
            >
              <div class="pl-5 pb-2 text-caption">
                {{ file.name }}
              </div>
              <v-divider />
              <div class="d-flex justify-end py-2 pr-3">
                <v-btn
                  size="x-small"
                  variant="text"
                  rounded="12"
                  color="orange-darken-2"
                  icon="mdi-download"
                  @click="downloadFile(file)"
                />
                <v-btn
                  size="x-small"
                  variant="text"
                  rounded="12"
                  color="orange"
                  icon="mdi-link"
                />
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ResourcesService } from "@/api/services/resources";
import { getExtensionFromFileName } from "@/helpers/file";
import { MemoFile } from "@/models/memo";
import { useUserStore } from "@/store/user";
import { computed, onMounted, reactive } from "vue";
import { useI18n } from "vue-i18n";

interface State {
  files: MemoFile[];
  loading: boolean;
}

const resourcesService = new ResourcesService();
const userStore = useUserStore();
const i18n = useI18n();

const state: State = reactive({
  files: [],
  loading: false
});

const groupedFiles = computed(() => {
  const groups = {};
  const extensions = new Set(state.files.map((f) => getExtensionFromFileName(f.name)));

  for (const extension of extensions) {
    groups[extension] = [];
  }

  for (const file of state.files) {
    const ext = getExtensionFromFileName(file.name);
    groups[ext].push(file);
  }

  return groups;
});

const downloadFile = (file: MemoFile) => {
  //
};

onMounted(async () => {
  state.loading = true;
  const files = await resourcesService.getFiles(userStore.user!.id);
  state.files = files;
  state.loading = false;
});
</script>
