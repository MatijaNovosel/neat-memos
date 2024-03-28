import { Field, Form } from "vee-validate";

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>;
  export default component;
}

declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    VvForm: typeof Form;
    VvField: typeof Field;
  }
}
