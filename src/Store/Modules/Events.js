import {apolloClient} from '../../main'

import events from '../../GraphQL/Queries/Events/events.graphql'
import event from '../../GraphQL/Queries/Events/event.graphql'
import topEvents from '../../GraphQL/Queries/Home/topEvents.graphql'

import dashboardEvents from '../../GraphQL/Queries/Dashboard/events.graphql'
import dashboardEvent from '../../GraphQL/Queries/Dashboard/event.graphql'

import deleteEvent from '../../GraphQL/Queries/Dashboard/deleteEvent.graphql'

import addEvent from '../../GraphQL/Queries/Dashboard/addEvent.graphql'
import updateEvent from '../../GraphQL/Queries/Dashboard/updateEvent.graphql'


export default {
  state: {
    events: [],
    event:{},
    topEvents: [],

    dashboardEvents: [],
    dashboardEvent: {}
  },
  getters: {
    dashboardEvent: state =>{
      return state.dashboardEvent;
    },
    dashboardEvents: state =>{
      return state.dashboardEvents;
    },
    event: state => {
      return state.event
    },
    topEvents: state => {
      const result = state.topEvents.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });

      return result;
    },
    events: state => {
      return state.events;
    },
  },
  mutations: {
    dashboardEvent: (state, dashboardEvent) =>{
      state.dashboardEvent = dashboardEvent;
    },
    dashboardEvents: (state, dashboardEvents) =>{
      state.dashboardEvents = dashboardEvents;
    },
    topEvents: (state,topEvents) =>{
      state.topEvents = topEvents;
    },
    event: (state,event) => {
      state.event = event;
    },
    events: (state, events) => {
      state.events = events;
    },
    addEvent: (state, newEvent) => {
      state.dashboardEvents.push({
        id: newEvent.id,
        name: newEvent.name,
        date: newEvent.date
      });
    },
    updateEvent: (state, event) => {
      let toUpdate = state.dashboardEvents.filter(x => x.id === event.id)[0];
      console.log(event);
      state.dashboardEvents[state.dashboardEvents.indexOf(toUpdate)] = event;
    },
    deleteEvent:(state, deleteEvent) =>{
      state.dashboardEvents.splice(state.dashboardEvents.indexOf(deleteEvent),1);      
    }
  },
  actions: {
    dashboardEvent: async({commit}, id) =>{
      let response = await apolloClient.query({
        query: dashboardEvent,
        variables:{
          id: id
        }
      });
      commit('dashboardEvent', response.data.dashboardEvent);
    },
    dashboardEvents: async({commit}) =>{
      let response = await apolloClient.query({
        query: dashboardEvents
      });
      commit('dashboardEvents', response.data.dashboardEvents);
    },
    topEvents: async({commit}) => {
      let response = await apolloClient.query({
        query: topEvents
      });

      commit('topEvents', response.data.topEvents);
    },
    event: async({commit}, id) => {
      let response = await apolloClient.query({
        query: event,
        variables:{
          id: id
        }
      });

      commit('event', response.data.event);
    },
    events: async ({commit}) => {

      let response = await apolloClient.query({
        query: events
      });

      commit('events', response.data.events);
    },
    addEvent: async ({commit}, event, images) => {
      let formData = new FormData();
      formData.append("graphql", `{ "query": "${addEvent.loc.source.body}", "variables": 
        ${JSON.stringify(event)}
      }`);
      
      if(images)
      {
        for(let i = 0;i < images.length;i++)
        {
          formData.append(i, images[i]);
        }
      }
      commit("addEvent", event);
      await fetch("http://localhost:5000/api/graphql", {
        method: 'post',
        body: formData
      });   
    },
    updateEvent: async ({commit}, event, images) => {
      let formData = new FormData();
      formData.append("graphql", `{ "query": "${updateEvent.loc.source.body}", "variables": 
        ${JSON.stringify(event)}
      }`);
      
      if(images)
      {
        for(let i = 0;i < images.length;i++)
        {
          formData.append(i, images[i]);
        }
      }
      commit("updateEvent", {
        name: event.name,
        date: event.date,
        id: event.id
      });
      await fetch("http://localhost:5000/api/graphql", {
        method: 'post',
        body: formData
      });
    },
    deleteEvent: async ({commit}, event) => {
      commit("deleteEvent", event);
      await apolloClient.mutate({
          mutation: deleteEvent,
          variables:{
            id: event.id
          }
        });
    },
  }
}