import firebase from 'firebase'
import events from './Events'
import settlements from './Settlements'

export default {
  state: {
    players: [],
  },
  events,
  settlements,
  getters: {
    player: state => id => {
      return state.players.filter(player => {
        return player.id === id;
      });
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
    topPlayers: state => {
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

      return result.slice(0,5);
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
      state.players.forEach(player => {
        if (settlements.state.settlements) {
          settlements.state.settlements.forEach(settlement => {
            if (settlement && settlement.id === player.settlementId) {
              player.settlement = settlement.name;
            }
          });
        }
      });

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
    players: (state, players) => {
      state.players = players;
    },
    addPlayer: (state, newPlayer) => {
      state.players.push(newPlayer);
    },
    updatePlayer: (state, player) => {
      state.players[state.players.indexOf(player)] = player;
    },
    removePlayer: (state, player) => {
      state.players.splice(state.players.indexOf(player), 1);
    },
  },
  actions: {
    players: async ({commit}) => {
      const data = await firebase.database().ref('players').once('value');
      let players = [];
      const dataValue = data.val();

      Object.keys(dataValue).forEach(itemKey => {
        players.push({
          id: itemKey,
          name: dataValue[itemKey].name,
          settlement: dataValue[itemKey].settlement,
          settlementId: dataValue[itemKey].settlementId,
          imageUrl: dataValue[itemKey].imageUrl
        });
      });

      commit('players', players);
    },
    addPlayer: async ({commit}, player) => {
      let imageUrl;
      let key;
      let uploadImg = player.img;

      const newPlayer = {
        name: player.name,
        settlement: player.settlement,
        settlementId: player.settlementId,
      };

      const data = firebase.database().ref("players").push(newPlayer);
      key = data.key;

      if (uploadImg) {
        const storageRef = firebase.storage().ref();
        uploadImg = storageRef.child(`players/${key}`).put(uploadImg);

        uploadImg.on('state_changed', snapshot => {}, error => console.log(error), async () => {
          const downloadURL = await uploadImg.snapshot.ref.getDownloadURL();
          imageUrl = downloadURL;

          firebase.database().ref('players').child(key).update({imageUrl: imageUrl});

          commit('addPlayer', {
            ...newPlayer,
            imageUrl: imageUrl,
            id: key,
          });
        });
      } else {
        await firebase.database().ref('players').child(key).update({key: key});

        commit('addPlayer', {
          ...newPlayer,
          id: key,
        });
      }
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
      await firebase.database().ref('players').child(player.id).remove();

      if (player.imageUrl) {
        const storageRef = firebase.storage().ref();
        await storageRef.child(`players/${player.id}`).delete();
      }
      commit('removePlayer', player);
    },
  }
}