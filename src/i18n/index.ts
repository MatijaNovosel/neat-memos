import { createI18n } from "vue-i18n";
import en from "./en";
import hr from "./hr";

export default createI18n({
  legacy: false,
  locale: "hr",
  messages: {
    hr: {
      ...hr
    },
    en: {
      ...en
    }
  },
  fallbackLocale: "hr",
  silentFallbackWarn: true
});
