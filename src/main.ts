import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { createI18n, useI18n } from "vue-i18n";
import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n";
import { en, pt } from "vuetify/locale";

const messages = {
  en: {
    $vuetify: en
  },
  pt: {
    $vuetify: pt
  },
}

const i18n = createI18n({
  legacy: false, // Vuetify does not support the legacy mode of vue-i18n
  locale: "pt",
  fallbackLocale: "en",
  messages
});

const vuetify = createVuetify({
  components,
  directives,
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
});

const app = createApp(App);

app.use(router);
app.use(vuetify);

app.mount("#app");
