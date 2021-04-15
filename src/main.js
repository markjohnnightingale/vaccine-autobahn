import Vue from "vue";
import VueI18n from "vue-i18n";
import App from "./App.vue";
import Buefy from "buefy";
import config from "../config/config.json";
import messages from "../lang/index";
Vue.config.productionTip = false;
Vue.prototype.$config = config;
Vue.use(Buefy);
Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: config.locale,
  messages: messages
});
let instance = new Vue({
  i18n: i18n,
  render: h => h(App)
});
instance.$mount("#app");
