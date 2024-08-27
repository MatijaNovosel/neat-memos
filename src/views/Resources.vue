<template>
  <v-container class="main-ctr">
    <mobile-drawer-controls hide-right />
    <v-row v-if="state.loading">
      <v-progress-circular
        class="my-6 mx-auto"
        color="orange"
        size="50"
        indeterminate
      />
    </v-row>
    <v-row v-if="!state.loading">
      <v-col cols="12">
        <v-text-field
          hide-details
          density="compact"
          :bg-color="theme.current.value.dark ? '' : 'white'"
          placeholder="Search"
          v-model="state.searchText"
          prepend-inner-icon="mdi-magnify"
          clearable
        />
      </v-col>
      <v-col
        cols="12"
        class="pt-0 d-flex flex-gap"
      >
        <v-chip
          @click="selectTag(extension)"
          :key="i"
          :color="state.filterExtensions.includes(extension) ? 'orange' : 'grey'"
          density="compact"
          size="small"
          v-for="(extension, i) in extensions"
        >
          {{ extension }}
        </v-chip>
      </v-col>
    </v-row>
    <v-divider
      class="my-4"
      v-if="extensions.size"
    />
    <v-row
      class="mt-10 d-flex flex-column align-center"
      v-if="!groupedFilesCount && !state.loading"
    >
      <span class="text-h1 mb-5"> 😿 </span>
      <span class="text-h6"> {{ i18n.t("noDataFound") }}. </span>
    </v-row>
    <v-row v-if="!state.loading && groupedFilesCount">
      <div
        class="display-contents"
        v-for="(group, i) in Object.keys(groupedFiles)"
        :key="i"
      >
        <v-col
          cols="12"
          v-if="groupedFiles[group].length"
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
                class="pt-3"
              >
                <div class="pl-5 pb-2 d-flex align-center">
                  <v-icon
                    class="mr-3"
                    color="grey"
                  >
                    {{ getIconFromExtension(getExtensionFromFileName(file.name)) }}
                  </v-icon>
                  <div class="d-flex flex-column">
                    <span class="text-subtitle-2">
                      {{ file.name }} ({{ fileSizeReadable(file.size) }})
                    </span>
                    <span class="text-grey text-caption">
                      {{ formatDate(file.createdAt) }}
                    </span>
                  </div>
                </div>
                <v-divider />
                <div class="d-flex justify-end py-1 pr-3">
                  <v-btn
                    :loading="file.downloading"
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
                    :to="{
                      name: ROUTE_NAMES.MEMO,
                      params: {
                        id: file.memoId
                      }
                    }"
                    color="orange"
                    icon="mdi-link"
                  />
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </div>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ResourcesService } from "@/api/services/resources";
import {
  downloadFileFromUrl,
  fileSizeReadable,
  getExtensionFromFileName,
  getIconFromExtension
} from "@/helpers/file";
import { capitalize } from "@/helpers/string";
import { MemoFileDetailed } from "@/models/memo";
import ROUTE_NAMES from "@/router/routeNames";
import { useUserStore } from "@/store/user";
import { format, formatRelative, isToday } from "date-fns";
import { computed, onMounted, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useTheme } from "vuetify";

interface State {
  files: MemoFileDetailed[];
  loading: boolean;
  searchText: string;
  filterExtensions: string[];
}

const resourcesService = new ResourcesService();
const userStore = useUserStore();
const i18n = useI18n();
const theme = useTheme();

const state: State = reactive({
  files: [],
  loading: false,
  searchText: "",
  filterExtensions: []
});

const extensions = computed(() => {
  return new Set(state.files.map((f) => getExtensionFromFileName(f.name)));
});

const groupedFiles = computed<Record<string, MemoFileDetailed[]>>(() => {
  const groups: Record<string, MemoFileDetailed[]> = {};
  const extensions = new Set(state.files.map((f) => getExtensionFromFileName(f.name)));

  for (const extension of extensions) {
    groups[extension] = [];
  }

  for (const file of state.files) {
    const ext = getExtensionFromFileName(file.name);
    if (
      file.name.toLowerCase().includes(state.searchText) &&
      (state.filterExtensions.length ? state.filterExtensions.includes(ext) : true)
    ) {
      groups[ext].push(file);
    }
  }

  return groups;
});

const groupedFilesCount = computed(() => {
  return Object.values(groupedFiles.value).flat().length;
});

const formatDate = (date: string) => {
  const d = new Date(date);
  if (isToday(d)) {
    return capitalize(formatRelative(d, new Date()));
  } else {
    return format(d, "dd.MM.yyyy. HH:mm");
  }
};

const downloadFile = async (file: MemoFileDetailed) => {
  file.downloading = true;
  await downloadFileFromUrl(file.url, file.name);
  file.downloading = false;
};

const selectTag = (tag: string) => {
  if (!state.filterExtensions.includes(tag)) {
    state.filterExtensions.push(tag);
  } else {
    state.filterExtensions = state.filterExtensions.filter((ext) => ext !== tag);
  }
};

onMounted(async () => {
  state.loading = true;
  const files = await resourcesService.getFiles(userStore.user!.id);
  state.files = files.map((f) => ({ ...f, downloading: false }));
  state.loading = false;
});
</script>
