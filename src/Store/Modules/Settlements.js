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
    addSettlement: async ({commit}, {settlement, image}) => {
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
    updateSettlement: async ({commit}, {settlement, image}) => {
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
    }
  }
}