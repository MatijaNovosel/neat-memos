<template>
  <v-select
    prepend-icon="mdi-earth"
    hide-details
    density="compact"
    v-model="language"
    :items="LANGUAGE_OPTIONS"
    :placeholder="i18n.t('language')"
    @update:model-value="updateLanguage"
  >
    <template #selection="{ item }">
      <div class="d-flex items-center">
        <img
          class="mr-2"
          width="20"
          :src="`/flags/${item.value}.svg`"
        />
        <div>
          {{ item.title }}
        </div>
      </div>
    </template>
    <template #item="{ props, item }">
      <v-list-item v-bind="props">
        <template #prepend>
          <img
            class="mr-2"
            width="20"
            :src="`/flags/${item.raw.value}.svg`"
          />
        </template>
      </v-list-item>
    </template>
  </v-select>
</template>

<script lang="ts" setup>
import { LANGUAGE_OPTIONS } from "@/constants/app";
import { useAppStore } from "@/store/app";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const appStore = useAppStore();
const i18n = useI18n();

const language = ref<string | null>(null);

const updateLanguage = () => {
  appStore.setLanguage(language.value || "en");
};

onMounted(() => {
  language.value = appStore.language;
});
</script>
