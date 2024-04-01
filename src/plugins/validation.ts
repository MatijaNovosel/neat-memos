import { localize, setLocale } from "@vee-validate/i18n";
import en from "@vee-validate/i18n/dist/locale/en.json";
import hr from "@vee-validate/i18n/dist/locale/hr.json";
import * as rules from "@vee-validate/rules";
import { configure, defineRule } from "vee-validate";

configure({
  generateMessage: localize({
    en: {
      messages: { ...en.messages }
    },
    hr: {
      messages: { ...hr.messages }
    }
  }),
  validateOnBlur: false,
  validateOnChange: false,
  validateOnInput: false,
  validateOnModelUpdate: false
});

setLocale("en");

Object.keys(rules).forEach((rule) => {
  if (rule != "default") {
    // @ts-ignore
    defineRule(rule, rules[rule]);
  }
});

defineRule("must_not_be_in_array", (value: string, array) => {
  if (!value || !value.length) {
    return true;
  }

  if (array.includes(value)) {
    return "Tag already exists!";
  }

  return true;
});
