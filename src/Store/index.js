import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase';
import router from '@/Router/index';

//Modules
import shared from './Modules/Shared'
import events from './Modules/Events'
import players from './Modules/Players'
import settlements from './Modules/Settlements'
import news from './Modules/News'
import signIn from './Modules/SignIn'

Vue.use(Vuex);
Vue.use(firebase);

export default new Vuex.Store({
  modules: {
    shared: shared,
    events: events,
    players: players,
    settlements: settlements,
    news: news,
    signIn: signIn
  },
  state: {
    user: null,
    signInError: null
  },
  getters: {
    user: state => {
      return state.user;
    },
    signInError: state => {
      return state.signInError;
    }
  },
  mutations: {
    singIn: (state, user) => {
      state.user = user;
      router.push("/panel");
    },
    logout: state => {
      state.user = null;
    },
    signInError: (state, error) => {
      state.signInError = error;
    },
    clearErrors: state => {
      state.signInError = null;
    },
  },
  actions: {
    signIn: ({commit}, user) => {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
          .then(user => {
            const newUser = {
              id: user.user.uid,
              email: user.user.email
            };
            commit("singIn", newUser);
            commit("clearErrors");
          })
          .catch(error => {
            console.log(error);
            commit("signInError", error);
          })
    },
    autoSignIn: ({commit}, user) => {
      const newUser = {
        id: user.uid,
        email: user.email
      };
      commit('singIn', newUser);
      commit("clearErrors");
    },
    logout: ({commit}) => {
      firebase.auth().signOut();
      commit('logout');
      router.push("/sign-in");
    },
  }
});