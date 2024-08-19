module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "@vue/typescript/recommended"],
  rules: {
    "no-console": "off",
    "no-debugger": "off",
    "no-empty-function": "off",
    "space-before-function-paren": "off",
    "no-unused-vars": "off",
    "brace-style": "off",
    "no-extra-boolean-cast": "off",
    quotes: "off",
    semi: "off",
    "eol-last": "off",
    eqeqeq: "off",
    "no-trailing-spaces": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "vue/valid-v-slot": "off",
    "vue/multi-word-component-names": "off",
    "vue/no-v-text-v-html-on-component": "off",
    "vue/no-deprecated-v-bind-sync": "off",
    "vue/no-setup-props-destructure": "off",
    "vue/no-deprecated-dollar-listeners-api": "off",
    "vue/one-component-per-file": "off",
    "no-undef": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "vue/max-attributes-per-line": "off",
    "vue/html-self-closing": "off"
  }
};
