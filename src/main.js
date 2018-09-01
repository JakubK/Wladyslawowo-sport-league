import Vue from 'vue'
import App from './App.vue'
import * as firebase from 'firebase'
import './Firebase'
import Router from './Router/index'
import Store from './Store/index'
import Vuelidate from 'vuelidate'

Vue.use(Vuelidate)

Vue.config.productionTip = false

new Vue({
  router: Router,
  store: Store,
  render: h => h(App),
  created () {
    this.$store.dispatch('settlements');
    this.$store.dispatch('players');
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch("autoSignIn", user);
      }
    })
  }
}).$mount('#app')
