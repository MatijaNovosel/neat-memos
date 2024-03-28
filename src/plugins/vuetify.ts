import i18n from "@/i18n";
import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";
import { md3 } from "vuetify/blueprints";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { fa } from "vuetify/iconsets/fa";
import { mdi } from "vuetify/iconsets/mdi";
import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n";
import "vuetify/styles";
import { useI18n } from "vue-i18n";

export default createVuetify({
  blueprint: md3,
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    sets: {
      mdi,
      fa
    }
  },
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n })
  }
});
