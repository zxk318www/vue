import Vue from "vue";
import VueCompositionApi from "@vue/composition-api";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "@/styles/element-variables.scss";
import lottie from "vue-lottie";

Vue.use(ElementUI);
Vue.use(VueCompositionApi);
Vue.component("lottie", lottie);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
