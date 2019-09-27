import {apolloClient} from '../../main'

import players from '../../GraphQL/Queries/Players/players.graphql'
import player from '../../GraphQL/Queries/Players/player.graphql'
import topPlayers from '../../GraphQL/Queries/Home/topPlayers.graphql'

import dashboardPlayers from '../../GraphQL/Queries/Dashboard/players.graphql'
import dashboardPlayer from '../../GraphQL/Queries/Dashboard/player.graphql'
import deletePlayer from '../../GraphQL/Queries/Dashboard/deletePlayer.graphql'
import addPlayer from '../../GraphQL/Queries/Dashboard/addPlayer.graphql'
import updatePlayer from '../../GraphQL/Queries/Dashboard/updatePlayer.graphql'

export default {
  state: {
    players: [],
    player:{},
    topPlayers: [],
    dashboardPlayers: [],
    dashboardPlayer: {}
  },
  getters: {
    dashboardPlayer: state =>{
      return state.dashboardPlayer;
    },
    dashboardPlayers: state =>{
      return state.dashboardPlayers;
    },
    topPlayers: state => {
      return state.topPlayers;
    },
    player: state => {
      return state.player;
    },
    players: state => {
      return state.players;
    },
  },
  mutations: {
    dashboardPlayer:(state, dashboardPlayer) => {
      state.dashboardPlayer = dashboardPlayer;
    },
    removePlayer:(state, player) =>{
      state.dashboardPlayers.splice(state.dashboardPlayers.indexOf(player), 1);
    },
    dashboardPlayers:(state, dashboardPlayers) =>{
      state.dashboardPlayers = dashboardPlayers;
    },
    topPlayers:(state, topPlayers) => {
      state.topPlayers = topPlayers;
    },
    player:(state, player) => {
      state.player = player;
    },
    players: (state, players) => {
      state.players = players;
    },
    addPlayer: (state, newPlayer) => {
      state.dashboardPlayers.push(newPlayer);
    },
    updatePlayer: (state, player) => {
      state.players[state.players.indexOf(player)] = player;
    }
  },
  actions: {
    dashboardPlayer: async({commit}, id) =>{
      let response = await apolloClient.query({
        query: dashboardPlayer,
        variables:{
          id: id
        }
      });

      commit("dashboardPlayer",response.data.dashboardPlayer);
    },
    dashboardPlayers: async({commit}) =>{
      let response = await apolloClient.query({
        query: dashboardPlayers
      });

      commit("dashboardPlayers",response.data.dashboardPlayers);
    },
    topPlayers: async({commit}) =>{
      let response = await apolloClient.query({
        query: topPlayers
      });

      commit("topPlayers",response.data.topPlayers);
    },
    player: async({commit}, id) => {
      let response = await apolloClient.query({
        query: player,
        variables:{
          id: id
        }
      });

      commit("player",response.data.player);
    },
    players: async ({commit}) => {    
      let response = await apolloClient.query({
        query: players
      });
      commit('players', response.data.players);
    },
    addPlayer: async ({commit}, player, image) => {
      commit("addPlayer", player);
      let formData = new FormData();
        formData.append("graphql", `{ "query": "${addPlayer.loc.source.body}", "variables": 
          ${JSON.stringify(player)}
        }`);

        formData.append(0,image);

        fetch("http://localhost:5000/api/graphql", {
          method: 'post',
          body: formData
        });   
    },
    updatePlayer: async ({commit}, player, image) => {
      let formData = new FormData();
      formData.append("graphql", `{ "query": "${updatePlayer.loc.source.body}", "variables": 
        ${JSON.stringify(player)}
      }`);

      formData.append(0,image);        
      commit("updatePlayer", player);
      fetch("http://localhost:5000/api/graphql", {
        method: 'post',
        body: formData
      });
    },
    removePlayer: async ({commit}, player) => {
      commit("removePlayer", player);
      await apolloClient.mutate({
        mutation: deletePlayer,
        variables:{
          id: player.id
        }
      });
    }
  }
}