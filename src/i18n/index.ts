import { createI18n } from "vue-i18n";
import en from "./en";
import hr from "./hr";

export default createI18n({
  legacy: false,
  locale: "en",
  messages: {
    hr: {
      ...hr
    },
    en: {
      ...en
    }
  },
  fallbackLocale: "en",
  silentFallbackWarn: true
});
