<template>
  <main class="website-main">
    <div class="website-container">
      <div class="home">
        <div class="home-column">
          <Slider :lastNews="topNews"></Slider>
          <section class="info">
            <h3 class="home-title title is-4">Liga sportowa Gminy Władysławowo</h3>
            <p class="info-description">
              Liga Sportowa Gminy Władysławowo wystartowała w 2017 r. Chociaż pomysły na nią były
              już wcześniej, należało się do startu odpowiednio przygotować. W kolejnym roku,
              w ramach ligi jest już drugie tyle imprez sportowo-rekreacyjnych, co poprzednio.
              Niemal każdy może brać w nich udział, najważniejsze są chęci. Przez ten krótki
              czas wokół ligi skupiło się grono osób, którzy z uśmiechami na ustach rywalizują
              regularnie w różnych dyscyplinach sportowych. Zapraszamy do naszego grona wszystkich
              chętnych mieszkańców gminy Władysławowo!
            </p>
          </section>
          <section class="events">
            <h3 class="event-title">Imprezy</h3>
            <ul class="events-list" v-for="event in topEvents" :key="event.id">
              <li class="event">
                <figure class="event-img" style="background-image: url(https://stmed.net/sites/default/files/bicycle-wallpapers-31871-9909783.jpg);">
                </figure>
                <div class="event-description">
                  <h4 class="title is-5"><router-link :to="`events/${event.id}`" :aria-label="event.name" :title="event.name">{{event.name}}</router-link> </h4>
                  <!-- <p class="vent-description-text">{{event.description | reduceText }}</p> -->
                  <p class="vent-description-text">{{event.description}}</p>
                  <router-link class="event-description-btn button is-danger" :to="`events/${event.id}`" :aria-label="event.name" :title="event.name">Zobacz Więcej</router-link>
                  <span class="event-description-date">{{event.date}}</span>
                </div>
              </li>
            </ul>
          </section>
        </div>
        <div class="home-column">
          <!-- <Sidebar :players="topPlayers" :settlements="settlements"></Sidebar> -->
        </div>
      </div>
    </div>
    <Footer></Footer>
  </main>

</template>
<style lang="scss" src="./Home.scss" scoped></style>
<script>

import Sidebar from "./Sidebar/Sidebar"
import Slider from "./Slider/Slider";
import gql from 'graphql-tag'

import topPlayers from '../../GraphQL/Queries/topPlayers.graphql'
import topEvents from '../../GraphQL/Queries/topEvents.graphql'
import topNews from '../../GraphQL/Queries/topNews.graphql'

export default {
  name: "Home",
  components: {
    Slider,
    Sidebar
  },
  apollo:
  {
    topEvents: topEvents,
    topNews: topNews
  },
  computed: {
    // lastNews() {
    //   // return this.$store.getters.topNews;
    // },
    // // events() {
    // //   // return this.$store.getters.topEvents;
    // // },
    // settlements() {
    //   // return this.$store.getters.topSettlements;
    // },
  }
};

</script>