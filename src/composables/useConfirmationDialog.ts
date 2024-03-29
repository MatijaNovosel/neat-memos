import { inject, InjectionKey } from "vue";

export type ConfirmationDialogType = "success" | "info" | "warning" | "error";

export interface CreateConfirmDialogOptions {
  width?: string | number;
  showCancel?: boolean;
  persistent?: boolean;
  centerContent?: boolean;
  title: string;
  content?: string;
  type?: ConfirmationDialogType;
  icon?: string;
}

export type CreateConfirmDialog = (options?: CreateConfirmDialogOptions) => Promise<boolean>;

export const CreateConfirmDialogKey: InjectionKey<CreateConfirmDialog> =
  Symbol("CreateConfirmDialogKey");

export const useConfirmationDialog = () => {
  const dialog = inject(CreateConfirmDialogKey);
  if (!dialog) throw new Error("Could not resolve provider");
  return dialog;
};

export const ConfirmationDialogTypeIcon = {
  success: "mdi-checkbox-marked",
  info: "mdi-alert-circle",
  warning: "mdi-alert-box",
  error: "mdi-alert-rhombus"
};
