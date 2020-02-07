import Vue from 'vue'
import App from './App.vue'
import Router from './Router/index'
import Store from './Store/index'
import Vuelidate from 'vuelidate'
import VueCarousel from 'vue-carousel';
import "./Filters";
import Lightbox from 'vue-pure-lightbox'
import Footer from "@/Website/Footer/Footer.vue"
import Alert from "@/Dashboard/Alert/Alert.vue"
import "./Validation/Validation"

import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory' 
import VueApollo from 'vue-apollo'

const httpLink = createHttpLink({
  uri: "http://localhost:5000/graphql"
})

const cache = new InMemoryCache();

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

//Initial Vue libraries
Vue.use(Vuelidate)
Vue.use(VueCarousel)
Vue.use(Lightbox)
Vue.use(VueApollo)

//Global components
Vue.component("Footer", Footer);
Vue.component("Alert", Alert);

Vue.config.productionTip = false

new Vue({
  router: Router,
  store: Store,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
