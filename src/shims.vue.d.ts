import MobileDrawerControls from "@/components/mobileDrawerControls/MobileDrawerControls.vue";
import { Field, Form } from "vee-validate";
import { DatePicker } from "vue-3-material-date-picker";

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>;
  export default component;
}

declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    VvForm: typeof Form;
    VvField: typeof Field;
    MobileDrawerControls: typeof MobileDrawerControls;
    MDatePicker: typeof DatePicker;
  }
}
