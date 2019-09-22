import players from './Players'
import {apolloClient} from '../../main'

import events from '../../GraphQL/Queries/Events/events.graphql'
import event from '../../GraphQL/Queries/Events/event.graphql'

export default {
  state: {
    events: [],
    event:{}
  },
  players,
  getters: {
    event: state => {
      return state.event
    },
    topEvents: state => {
      const result = state.events.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });

      return result.slice(0,5);
    },
    events: state => {
      return state.events;
    },
  },
  mutations: {
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
    removeEvent: (state, event) =>{
      state.events.splice(state.events.indexOf(event),1);
    },
  },
  actions: {
    event: async({commit}, id) => {
      let response = await apolloClient.query({
        query: event
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
        players: event.players,
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
    removeEvent: async ({commit}, event) => {
      await firebase.database().ref('events').child(event.id).remove();
      const storageRef = firebase.storage().ref();

      if (event.imageUrls) {
        for (let i = 0; i < event.imageUrls.length; i++) {
         await storageRef.child(`events/${event.id}/${i}`).delete();
        }
      }

      commit("removeEvent", event);
    },
  }
}