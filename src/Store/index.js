import Vue from 'vue';
import Vuex from 'vuex';

//Modules
import shared from './Modules/Shared'
import events from './Modules/Events'
import players from './Modules/Players'
import settlements from './Modules/Settlements'
import news from './Modules/News'
import signIn from './Modules/SignIn'

Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    shared: shared,
    events: events,
    players: players,
    settlements: settlements,
    news: news,
    signIn: signIn
  }
});