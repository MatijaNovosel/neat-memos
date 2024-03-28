import { Field, Form } from "vee-validate";

export default {
  install: (app: any) => {
    app.component("VvForm", Form);
    app.component("VvField", Field);
  }
};
