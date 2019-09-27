import players from './Players'
import events from './Events'

import {apolloClient} from '../../main'

import settlements from '../../GraphQL/Queries/Settlements/settlements.graphql'
import settlement from '../../GraphQL/Queries/Settlements/settlement.graphql'
import topSettlements from '../../GraphQL/Queries/Home/topSettlements.graphql'

import dashboardSettlements from '../../GraphQL/Queries/Dashboard/settlements.graphql'
import deleteSettlement from '../../GraphQL/Queries/Dashboard/deleteSettlement.graphql'
import addSettlement from '../../GraphQL/Queries/Dashboard/addSettlement.graphql'

import updateSettlement from '../../GraphQL/Queries/Dashboard/updateSettlement.graphql'

export default {
  state: {
    settlements: [],
    settlement: {},
    topSettlements: [],

    dashboardSettlements: []
  },
  players,
  events,
  getters: {
    dashboardSettlements: state =>{
      return state.dashboardSettlements;
    },
    settlement: state => {
      return state.settlement;
    },
    topSettlements: state => {
      return state.topSettlements;
    },
    playerSettlements: () => id => {
      const playersCollection = players.getters.players(players.state).filter(player => player.settlementId === id);
      const allEvents = events.getters.events(events.state);
      let result = [];

      playersCollection.forEach(player => {
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

        result.push({
          player: player,
          points: sum
        });
      });

      return result;
    },
    settlementSeasonData: state => (id, season) =>
    {
      let result = [];
      let playersOfSettlement = players.getters.players(players.state).filter(player => player.settlementId === id);
      for(let i = 0;i < playersOfSettlement.length;i++)
      {
        let playerDetails = players.getters.briefPlayerById(players.state, playersOfSettlement[i].id);
        for(let j = 0;j < playerDetails.playedEvents.length;j++)
        {
          if(playerDetails.playedEvents[j].season == season)
            result.push(playerDetails.playedEvents[j]);
        }
      }

      return result;
    },
    settlementTopSeason: state => id =>
    {
      const allEvents = events.getters.events(events.state);
      let newestSeason = Math.max.apply(Math, allEvents.map(function(o) { return o.season; }))
      return newestSeason;
    },
    briefSettlementById: state => id => {
      const allEvents = events.getters.events(events.state);
      const settlement = state.settlements.filter(settlement => settlement.id === id);
      let playersOfSettlement;
      let sum = 0;

      let [searchSettlement] = settlement;

      if (searchSettlement === undefined) {
        searchSettlement = {};
      }

      let newestSeason = Math.max.apply(Math, allEvents.map(function(o) { return o.season; }))

      playersOfSettlement = players.getters.players(players.state).filter(player => player.settlement === searchSettlement.name);

      if (allEvents) {
        allEvents.forEach(event => {
          if (event.players) {
            event.players.forEach(player => {
              playersOfSettlement.forEach(item => {
                if (player.name === item.name) {
                  if(item.season == newestSeason)
                  {
                    sum += parseInt(player.points);
                  }                
                }  
              })
            });
          }
        });
      }

      return {
        id: searchSettlement.id,
        name: searchSettlement.name,
        description: searchSettlement.description,
        points: sum,
        imageUrl: searchSettlement.imageUrl,
        playerCount: playersOfSettlement.length
      }
    },
    settlements: state => {
      return state.settlements;
    }
  },
  mutations: {
    dashboardSettlements: (state,dashboardSettlements) => {
      state.dashboardSettlements = dashboardSettlements;
    },
    topSettlements:(state, topSettlements) => {
      state.topSettlements = topSettlements;
    },
    settlement: (state,settlement) => {
      state.settlement = settlement;
    },
    settlements: (state, settlements) => {
      state.settlements = settlements;
    },
    addSettlement: (state, newSettlement) => {
      state.dashboardSettlements.push(newSettlement);
    },
    updateSettlement: (state, settlement) => {
      let result = state.dashboardSettlements.find(item => item.id === settlement.id);
      let index = (state.dashboardSettlements.indexOf(result));

      state.dashboardSettlements.splice(index,1,settlement);
    },
    removeSettlement: (state, settlement) => {
      state.dashboardSettlements.splice(state.dashboardSettlements.indexOf(settlement), 1);
    }
  },
  actions: {
    dashboardSettlements: async({commit}) => {
      let response = await apolloClient.query({
        query: dashboardSettlements
      });
      commit('dashboardSettlements', response.data.dashboardSettlements);
    },
    topSettlements: async({commit}) =>{
      let response = await apolloClient.query({
        query: topSettlements
      });

      commit('topSettlements', response.data.topSettlements);
    },
    settlement: async({commit}, id) => {
      let response = await apolloClient.query({
        query: settlement,
        variables:{
          id: id
        }
      });

      commit('settlement', response.data.settlement);
    },
    settlements: async ({commit}) => {
      let response = await apolloClient.query({
        query: settlements
      });
      commit('settlements', response.data.settlements);
    },
    addSettlement: async ({commit}, settlement, image) => {
      let formData = new FormData();
        formData.append("graphql", `{ "query": "${addSettlement.loc.source.body}", "variables": 
          ${JSON.stringify(settlement)}
        }`);

        formData.append(0,image);
        commit("addSettlement", settlement);
        fetch("http://localhost:5000/api/graphql", {
          method: 'post',
          body: formData
        });   
        
    },
    updateSettlement: async ({commit}, settlement, image) => {
      commit('updateSettlement', settlement);
      let formData = new FormData();
        formData.append("graphql", `{ "query": "${updateSettlement.loc.source.body}", "variables": 
        ${JSON.stringify(settlement)}
      }`);

      formData.append(0,image);        

      fetch("http://localhost:5000/api/graphql", {
        method: 'post',
        body: formData
      });
    },
    removeSettlement: async ({commit}, settlement) => {
      commit("removeSettlement", settlement);
      apolloClient.mutate({
        mutation: deleteSettlement,
        variables:{
          id: settlement.id
        }
      });
    },
  }
}