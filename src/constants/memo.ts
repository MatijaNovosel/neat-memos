import i18n from "@/i18n";
import { computed } from "vue";

export const MEMO_VISIBILITY = {
  PRIVATE: 1,
  PUBLIC: 2
};

export const memoVisibilityItems = computed(() => [
  {
    title: i18n.global.t("private"),
    value: MEMO_VISIBILITY.PRIVATE
  },
  {
    title: i18n.global.t("public"),
    value: MEMO_VISIBILITY.PUBLIC
  }
]);

export const MEMO_ACTIONS = {
  PIN: "pin",
  DELETE: "delete",
  ARCHIVE: "archive",
  EDIT: "edit",
  SHARE: "share"
};

export const memoActionItems = computed(() => [
  {
    icon: "mdi-pin",
    text: i18n.global.t("pin"),
    type: MEMO_ACTIONS.PIN,
    color: "grey"
  },
  {
    icon: "mdi-delete-outline",
    text: i18n.global.t("delete"),
    type: MEMO_ACTIONS.DELETE,
    color: "red"
  },
  {
    icon: "mdi-pencil",
    text: i18n.global.t("edit"),
    type: MEMO_ACTIONS.EDIT,
    color: "grey"
  },
  {
    icon: "mdi-share",
    text: i18n.global.t("share"),
    type: MEMO_ACTIONS.SHARE,
    color: "grey"
  }
]);

export const MEMO_ADDITIONAL_ACTIONS = {
  PREVIEW: "preview",
  ADD_CODE_BLOCK: "addCodeBlock",
  ADD_CHECKLIST: "addChecklist"
};

export const memoAdditionalActionItems = computed(() => [
  {
    icon: "mdi-view-module",
    text: i18n.global.t("preview"),
    type: MEMO_ADDITIONAL_ACTIONS.PREVIEW,
    color: "grey"
  },
  {
    icon: "mdi-code-braces",
    text: i18n.global.t("addCodeBlock"),
    type: MEMO_ADDITIONAL_ACTIONS.ADD_CODE_BLOCK,
    color: "grey"
  },
  {
    icon: "mdi-checkbox-marked",
    text: i18n.global.t("addTaskList"),
    type: MEMO_ADDITIONAL_ACTIONS.ADD_CHECKLIST,
    color: "grey"
  }
]);

export const DEFAULT_CODE_BLOCK = `\`\`\`javascript
const x = 1;
\`\`\``;

export const DEFAULT_CHECK_LIST = `- [ ] 1
- [ ] 2
- [ ] 3`;

export const MEMO_FILTERS = {
  SEARCH_TEXT: 1,
  TAG: 2
};
