import { createI18n } from "vue-i18n";
import enApp from "./en";
import hrApp from "./hr";
import { en, hr } from "vuetify/locale";

export default createI18n({
  legacy: false,
  locale: "en",
  messages: {
    hr: {
      $vuetify: {
        ...hr
      },
      ...hrApp
    },
    en: {
      $vuetify: {
        ...en
      },
      ...enApp
    }
  },
  fallbackLocale: "en",
  silentFallbackWarn: true
});
