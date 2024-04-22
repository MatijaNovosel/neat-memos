import MobileDrawerControls from "@/components/mobileDrawerControls/MobileDrawerControls.vue";
import { Field, Form } from "vee-validate";
import { DatePicker } from "vue-3-material-date-picker";
import "vue-3-material-date-picker/dist/style.css";

export default {
  install: (app: any) => {
    app.component("VvForm", Form);
    app.component("VvField", Field);
    app.component("m-date-picker", DatePicker);
    app.component("mobile-drawer-controls", MobileDrawerControls);
  }
};
