import {apolloClient} from '../../main'

import events from '../../GraphQL/Queries/Events/events.graphql'
import event from '../../GraphQL/Queries/Events/event.graphql'
import topEvents from '../../GraphQL/Queries/Home/topEvents.graphql'

import dashboardEvents from '../../GraphQL/Queries/Dashboard/events.graphql'
import dashboardEvent from '../../GraphQL/Queries/Dashboard/event.graphql'

import deleteEvent from '../../GraphQL/Queries/Dashboard/deleteEvent.graphql'

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
      state.events.push(newEvent);
    },
    updateEvent: (state, event) => {
      state.events[state.events.indexOf(event)] = event;
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
    addEvent: async ({commit}, event) => {
      const newEvent = {
        name: event.name,
        description: event.description,
        date: event.date,
        season: event.season
      };

      let key;
      let imageUrls = [];

      const data = await firebase.database().ref("events").push(newEvent)
      key = data.key;

      if (event.images.length > 0) {
        for (let i = 0;i < event.images.length;i++) {
          const storageRef = firebase.storage().ref();
          event.images[i] = storageRef.child(`events/${key}/${i}`).put(event.images[i]);

          event.images[i].on('state_changed', snapshot => {}, error => { console.log(error) }, async () => {
            let downloadURL = await event.images[i].snapshot.ref.getDownloadURL();

            imageUrls.push(downloadURL);
            firebase.database().ref('events').child(key).update({imageUrls: imageUrls});
          });
        }

        commit('addEvent', {
          ...newEvent,
          imageUrls: imageUrls,
          id: key
        });
      } else {
        commit('addEvent', {
          ...newEvent,
          id: key
        });
      }
    },
    updateEvent: async ({commit}, event) => {
      if (event.players === undefined) {
        event.players = [];
      }
      const storageRef = firebase.storage().ref();

      await firebase.database().ref('events').child(event.id).update(event).then(key => {
        if (event.files) {
          let putIndex = event.imageUrls.legnth;
          for (let i = 0;i < event.files.length;i++) {
            event.files[i] = storageRef.child(`events/${event.id}/${putIndex}`).put(event.files[i]);
          }
        }
      }).then(() => {
        for (let i = 0;i < event.files.length;i++) {
          event.files[i].snapshot.ref.getDownloadURL().then(function (downloadURL) {
            event.imageUrls.push(downloadURL);
            firebase.database().ref('events').child(event.id).update({imageUrls: event.imageUrls});
          });
        }
      });

      await firebase.database().ref('events').child(event.id).update(event);
      commit('updateEvent', event);
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