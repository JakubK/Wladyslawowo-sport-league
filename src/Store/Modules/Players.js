import firebase from 'firebase'
import events from './Events'
import settlements from './Settlements'

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
  events,
  settlements,
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
    briefPlayerById: state => id => {
      const player = state.players.filter(player => player.id === id);
      const allEvents = events.getters.events(events.state);
      let sum = 0;
      let playedEvents = [];

      let [searchPlayer] = player;

      if (searchPlayer === undefined) {
        searchPlayer = {};
      }

      //get latest season
      let newestSeason = Math.max.apply(Math, allEvents.map(function(o) { return o.season; }))

      if (allEvents) {
        allEvents.forEach(item => {
          if (item.players) {
            item.players.forEach(player => {
              if (player.name === searchPlayer.name) {
                playedEvents.push({
                  name: item.name,
                  date: item.date,
                  points: parseInt(player.points),
                  season: item.season
                })

                if(item.season == newestSeason)
                {
                  sum += parseInt(player.points);
                }
              }
            })
          }
        })
      }

      settlements.state.settlements.forEach(item => {
        if (item.id === searchPlayer.settlementId) {
          searchPlayer.settlement = item.name;
        }
      });

      return {
        id: searchPlayer.id,
        name: searchPlayer.name,
        points: sum,
        settlement: searchPlayer.settlement,
        imageUrl: searchPlayer.imageUrl,
        playedEvents: playedEvents
      }
    },
    playersByScore: state => {
      let allEvents = events.getters.events(events.state);
      let result = state.players.map(player => {
        let sum = 0;

        if (allEvents) {
          allEvents.forEach(event => {
            if (event.players) {
              event.players.forEach(item => {
                if (item.name === player.name) {
                  sum += parseInt(item.points);
                }
              });
            }
          });
        }

        return {
          id: player.id,
          name: player.name,
          points: sum,
          settlement: player.settlement,
          imageUrl: player.imageUrl
        }
      });

      result = result.sort((a,b) => {
        if (a.points > b.points) {
          return -1;
        } else if (b.points > a.points) {
          return 1;
        }
        return 0;
      });

      return result;
    },
    players: state => {
      return state.players;
    },
    playerTopSeason: state => player => 
    {
      let max = 0;
      for(let i = 0;i < player.playedEvents.length;i++)
      {
        if(player.playedEvents[i].season > max)
          max = player.playedEvents[i].season;
      }

      return max;
    },
    seasonData: state => (player,season) =>
    {
      let result = [];
      for(let i = 0;i < player.playedEvents.length;i++)
      {
        if(player.playedEvents[i].season == season)
          result.push(player.playedEvents[i]);
      }

      return result;
    }
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