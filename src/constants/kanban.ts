export const ratingColor: Record<number, string> = {
  1: "red",
  2: "orange",
  3: "yellow-lighten-2",
  4: "light-green-lighten-2",
  5: "green"
};

export const COLUMN_ACTIONS = {
  CREATE_CARD: "createCard",
  DELETE: "delete"
};

export const CARD_ACTIONS = {
  DELETE: "delete",
  MARK_URGENT: "markUrgent",
  ADD_RATING: "addRating"
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
  },
  {
    icon: "mdi-alert-circle",
    text: "Mark as urgent",
    type: CARD_ACTIONS.MARK_URGENT,
    color: "red-lighten-2"
  },
  {
    icon: "mdi-circle",
    text: "Add rating",
    type: CARD_ACTIONS.ADD_RATING,
    color: "green"
  }
];

export const dropPlaceholderOptions = {
  className: "drop-preview",
  animationDuration: "150",
  showOnTop: true
};

export const colorSwatches = [
  ["#F44336", "#E91E63", "#9C27B0"],
  ["#673AB7", "#3F51B5", "#2196F3"],
  ["#03A9F4", "#00BCD4", "#009688"],
  ["#4CAF50", "#8BC34A", "#CDDC39"],
  ["#FFEB3B", "#FFC107", "#FB8C00"]
];
