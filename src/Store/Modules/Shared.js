import router from '@/Router/index';
import {apolloClient} from '../../main'
import search from '../../GraphQL/Queries/search.graphql'

export default {
  state: {
    menuStatus: false,
    search: {}
  },
  getters: {
    menu: state => {
      return state.menuStatus;
    },
    search: state => {
      return state.search;
    }
  },
  mutations: {
    search: (state,search) => {
      state.search = search;
    },
    closeModal: () => {
      router.go(-1);
    },
    toggleMenu: state => {
      state.menuStatus = !state.menuStatus;
    }
  },
  actions: {
    search: async ({commit}, phrase) => {
      phrase = phrase.toLowerCase();
      let response = await apolloClient.query({
        query: search,
        variables:{
          phrase: phrase
        }
      });
      commit("search", response.data);
    },
    closeModal: ({commit}) => {
      commit('closeModal');
    },
    toggleMenu: ({commit}) => {
      commit("toggleMenu");
    }
  }
}