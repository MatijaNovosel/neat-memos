import { FunctionalComponent } from "vue";

export type alertType = "success" | "info" | "warning" | "error" | undefined;

export interface Alert {
  id: number;
  timestamp: number | undefined;
  autoclose: boolean;
  timeout: number;
  closable: boolean;
  color: string | undefined;
  icon: boolean | string | (new () => any) | FunctionalComponent;
  text: string | undefined;
  type: alertType;
  value: boolean;
}

export interface CreateNotificationModel {
  text: string;
  type?: alertType;
  autoClose?: boolean | null;
}

export const AlertTypeColor = {
  success: "green",
  info: "blue",
  warning: "amber",
  error: "red"
};
