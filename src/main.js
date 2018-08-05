import Vue from 'vue'
import App from './App.vue'
import "./Firebase"
import VueFire from "vuefire"
import Router from "./Router/";
import Store from "./Store/";

Vue.use(VueFire);

Vue.config.productionTip = false

new Vue({
  router: Router,
  store: Store,
  render: h => h(App)
}).$mount('#app')
