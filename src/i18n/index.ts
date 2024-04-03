import { createI18n } from "vue-i18n";
import { de, en, hr, ja, uk, zhHans } from "vuetify/locale";
import cnApp from "./cn";
import deApp from "./de";
import enApp from "./en";
import hrApp from "./hr";
import jaApp from "./ja";
import uaApp from "./ua";

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
    },
    ja: {
      $vuetify: {
        ...ja
      },
      ...jaApp
    },
    de: {
      $vuetify: {
        ...de
      },
      ...deApp
    },
    cn: {
      $vuetify: {
        ...zhHans
      },
      ...cnApp
    },
    ua: {
      $vuetify: {
        ...uk
      },
      ...uaApp
    }
  },
  fallbackLocale: "en",
  silentFallbackWarn: true
});
