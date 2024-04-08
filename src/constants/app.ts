import i18n from "@/i18n";
import { computed } from "vue";

export const THEME_OPTIONS = computed(() => [
  {
    title: i18n.global.t("dark"),
    value: "dark"
  },
  {
    title: i18n.global.t("light"),
    value: "light"
  }
]);

export const LANGUAGE_OPTIONS = computed(() => [
  {
    title: i18n.global.t("languages.en"),
    value: "en"
  },
  {
    title: i18n.global.t("languages.hr"),
    value: "hr"
  },
  {
    title: i18n.global.t("languages.de"),
    value: "de"
  },
  {
    title: i18n.global.t("languages.ja"),
    value: "ja"
  },
  {
    title: i18n.global.t("languages.cn"),
    value: "cn"
  },
  {
    title: i18n.global.t("languages.ua"),
    value: "ua"
  }
]);

export const MAX_FILE_SIZE = 10_000_000;
