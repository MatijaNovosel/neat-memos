export const COLUMN_ACTIONS = {
  CREATE_CARD: "createCard",
  DELETE: "delete"
};

export const CARD_ACTIONS = {
  DELETE: "delete"
};

export const columnActions = [
  {
    icon: "mdi-delete-outline",
    text: "Delete",
    type: COLUMN_ACTIONS.DELETE,
    color: "red"
  },
  {
    icon: "mdi-plus-box",
    text: "Create card",
    type: COLUMN_ACTIONS.CREATE_CARD,
    color: "blue"
  }
];

export const cardActions = [
  {
    icon: "mdi-delete-outline",
    text: "Delete",
    type: CARD_ACTIONS.DELETE,
    color: "red"
  }
];

export const dropPlaceholderOptions = {
  className: "drop-preview",
  animationDuration: "150",
  showOnTop: true
};
