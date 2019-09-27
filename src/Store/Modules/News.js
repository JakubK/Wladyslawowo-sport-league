import Vue from 'vue'
import {apolloClient} from '../../main'

import newses from '../../GraphQL/Queries/Newses/newses.graphql'
import news from '../../GraphQL/Queries/Newses/news.graphql'
import topNews from '../../GraphQL/Queries/Home/topNews.graphql'

import dashboardNewses from '../../GraphQL/Queries/Dashboard/newses.graphql'
import deleteNews from '../../GraphQL/Queries/Dashboard/deleteNews.graphql'

export default {
  state: {
    newses: [],
    news:{},
    topNews: [],

    dashboardNewses: []
  },
  getters: {
    dashboardNewses: state => {
      return state.dashboardNewses;
    },
    topNews: state =>{
      return state.topNews;
    },
    news: state => {
      return state.news;
    },
    newses: state => {
      return state.newses.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
    },
    briefNewsById: state => newsId => {
      const news = state.news.find(news => news.id === newsId);

      if(news)
      {
        return {
          id: news.id,
          name: news.name,
          date: news.date,
          description: news.description,
          imageUrl: news.imageUrl
        }
      }
      else
        return;
    }
  },
  mutations: {
    dashboardNewses: (state,dashboardNewses) =>{
      state.dashboardNewses = dashboardNewses;
    },
    topNews: (state,topNews) =>{
      state.topNews = topNews;
    },
    news: (state,news) => {
      state.news = news;
    },
    newses: (state, newses) => {
      state.newses = newses;
    },
    addNews: (state, newNews) => {
      state.news.push(newNews);
    },
    updateNews: (state, news) => {
      let result = state.news.find(item => item.id === news.id);
      let index = (state.news.indexOf(result));

      Vue.set(state.news, index, news);
    },
    removeNews: (state, news) => {
      state.dashboardNewses.splice(state.dashboardNewses.indexOf(news), 1);
    }
  },
  actions: {
    dashboardNewses: async({commit}) =>{
      let response = await apolloClient.query({
        query: dashboardNewses
      });
      commit('dashboardNewses', response.data.dashboardNewses);
    },
    topNews: async({commit}) =>{
      let response = await apolloClient.query({
        query: topNews
      });
      commit('topNews', response.data.topNews);
    },
    news: async ({commit}, id) => {
      let response = await apolloClient.query({
        query: news,
        variables: {
          id: id
        }
      });
      commit('news', response.data.news);
    },
    newses: async ({commit}) => {
      let response = await apolloClient.query({
        query: newses
      });
      commit('newses', response.data.newses);
    },
    addNews: async ({commit}, news) => {
      let imageUrl;
      let key;
      let uploadImg = news.img;

      const newNews = {
        name: news.name,
        description: news.description,
        date: news.date,
      };

      const data = await firebase.database().ref("news").push(newNews);
      key = data.key;

      if (uploadImg) {
        const storageRef = firebase.storage().ref();
        uploadImg = storageRef.child(`news/${key}`).put(uploadImg);

        uploadImg.on('state_changed', snapshot => {}, error => console.log(error), async () => {
          let downloadURL = await uploadImg.snapshot.ref.getDownloadURL();
          imageUrl = downloadURL;

          await firebase.database().ref('news').child(key).update({imageUrl: imageUrl});

          commit('addNews', {
            ...newNews,
            imageUrl: imageUrl,
            id: key,
          });
        });
      } else {
        await firebase.database().ref('news').child(key).update({key: key});

        commit('addNews', {
          ...newNews,
          id: key,
        });
      }
    },
    updateNews: ({commit}, news) => {
      var editedImage = news.img !== undefined;
      let file, uploadImg, imageRef, imageUrl, storageRef;

      if(news.imageUrl === undefined)
        news.imageUrl = null;

      if (editedImage) {
        file = news.img.name;
        uploadImg = news.img;
        storageRef = firebase.storage().ref();

      }
      firebase.database().ref('news').child(news.id).update(news).then(key => {
        if (editedImage) {
          uploadImg = storageRef.child(`news/${news.id}`).put(uploadImg)
        }
      }).then(() => {
        if (editedImage) {
          uploadImg.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            imageUrl = downloadURL;
            firebase.database().ref('news').child(news.id).update({imageUrl: imageUrl});
            news.imageUrl = imageUrl;
          })
        }

        commit('updateNews', news);
      });
    },
    removeNews: async ({commit}, news) => {
      commit('removeNews', news);
      await apolloClient.mutate({
        mutation: deleteNews,
        variables:{
          id: news.id
        }
      });
    }
  }
}