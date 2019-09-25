import firebase from 'firebase'
import events from './Events'
import settlements from './Settlements'

import {apolloClient} from '../../main'

import players from '../../GraphQL/Queries/Players/players.graphql'
import player from '../../GraphQL/Queries/Players/player.graphql'
import topPlayers from '../../GraphQL/Queries/Home/topPlayers.graphql'

import dashboardPlayers from '../../GraphQL/Queries/Dashboard/players.graphql'
import deletePlayer from '../../GraphQL/Queries/Dashboard/deletePlayer.graphql'
import addPlayer from '../../GraphQL/Queries/Dashboard/addPlayer.graphql'

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
    addPlayer: async ({commit}, player) => {
      commit("addPlayer", player);
      await apolloClient.query({
        query: addPlayer
      });
    },
    updatePlayer: async ({commit}, player) => {
      let editedImage = player.img !== undefined;
      let file, uploadImg, imageUrl, storageRef;

      if (player.imageUrl === undefined) {
        player.imageUrl = null;
      }

      await firebase.database().ref('players').child(player.id).update(player);

      if (editedImage) {
        file = player.img.name;
        uploadImg = player.img;
        storageRef = firebase.storage().ref();

        uploadImg = storageRef.child(`players/${player.id}`).put(uploadImg);
        let downloadURL = await uploadImg.snapshot.ref.getDownloadURL();

        if (downloadURL === undefined) {
          downloadURL = null;
        }

        imageUrl = downloadURL;
        await firebase.database().ref('players').child(player.id).update({imageUrl: imageUrl});
        player.imageUrl = imageUrl;
      }

      commit('updatePlayer', player);
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