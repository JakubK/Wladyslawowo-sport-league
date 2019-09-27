import Vue from 'vue'
import {apolloClient} from '../../main'

import newses from '../../GraphQL/Queries/Newses/newses.graphql'
import news from '../../GraphQL/Queries/Newses/news.graphql'
import topNews from '../../GraphQL/Queries/Home/topNews.graphql'

import dashboardNewses from '../../GraphQL/Queries/Dashboard/newses.graphql'
import dashboardNews from '../../GraphQL/Queries/Dashboard/news.graphql'
import deleteNews from '../../GraphQL/Queries/Dashboard/deleteNews.graphql'
import addNews from '../../GraphQL/Queries/Dashboard/addNews.graphql'
import updateNews from '../../GraphQL/Queries/Dashboard/updateNews.graphql'

export default {
  state: {
    newses: [],
    news:{},
    topNews: [],

    dashboardNewses: [],
    dashboardNews: {}
  },
  getters: {
    dashboardNews: state => {
      return state.dashboardNews;
    },
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
    dashboardNews: (state, dashboardNews) =>{
      state.dashboardNews = dashboardNews;
    },
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
      state.dashboardNewses.push(newNews);
    },
    updateNews: (state, news) => {
      let result = state.dashboardNewses.find(item => item.id === news.id);
      let index = (state.dashboardNewses.indexOf(result));

      state.dashboardNewses.splice(index,1,news);
    },
    removeNews: (state, news) => {
      state.dashboardNewses.splice(state.dashboardNewses.indexOf(news), 1);
    }
  },
  actions: {
    dashboardNews: async({commit}, id) =>{
      let response = await apolloClient.query({
        query: dashboardNews,
        variables:{
          id: id
        }
      });
      commit('dashboardNews', response.data.dashboardNews);
    },
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
    addNews: async ({commit}, {news, image}) => {
      let formData = new FormData();
      formData.append("graphql", `{ "query": "${addNews.loc.source.body}", "variables": 
       ${JSON.stringify(news)}
      }`);

      formData.append(0,image);
      
      commit("addNews", news);
      fetch("http://localhost:5000/api/graphql", {
        method: 'post',
        body: formData
      });   
    },
    updateNews: ({commit}, {news, image}) => {
      let formData = new FormData();
        formData.append("graphql", `{ "query": "${updateNews.loc.source.body}", "variables": 
        ${JSON.stringify(news)}
        }`);

        formData.append(0,image);        
        commit("updateNews", news);
        fetch("http://localhost:5000/api/graphql", {
          method: 'post',
          body: formData
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