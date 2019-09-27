<template>
  <main class="website-main">
    <div class="website-container">
      <header class="website-header">
        <h1 class="panel-header-title title is-3">Wyszukiwanie - "{{phrase}}"</h1>
      </header>
      <div class="search">
        <ul class="search-tabs">
          <li @click="switchVisible(0)" class="search-tabs-item">
            <button :class="{active : visibleTab === 0}" class="search-tabs-item-btn" type="button" @click="switchVisible(0)" aria-label="Zawodnicy" title="Zawodnicy">Zawodnicy</button>
          </li>
          <li @click="switchVisible(1)" class="search-tabs-item">
            <button :class="{active : visibleTab === 1}" class="search-tabs-item-btn" type="button" @click="switchVisible(1)" aria-label="Dzielnica lub wieś" title="Dzielnica lub wieś">Dzielnica lub wieś</button>
          </li>
          <li @click="switchVisible(2)" class="search-tabs-item">
            <button :class="{active : visibleTab === 2}" class="search-tabs-item-btn" type="button" @click="switchVisible(2)" aria-label="Imprezy" title="Imprezy">Imprezy</button>
          </li>
          <li @click="switchVisible(3)" class="search-tabs-item">
            <button :class="{active : visibleTab === 3}" class="search-tabs-item-btn" type="button" @click="switchVisible(3)" aria-label="Wydarzenia" title="Wydarzenia">Wydarzenia</button>
          </li>
        </ul>
        <div class="search-data">
          <transition-group class="table-responsive" name="fade" tag="div">
            <div v-if="results.players && visibleTab === 0" class="search-data-item" :key="0">
              <p class="no-results" v-if="results.players.length <= 0">Brak wyników</p>
              <table v-if="results.players.length > 0" class="table-panel search-table" >
                <thead>
                <tr>
                  <th>lp.</th>
                  <th>Nazwisko i imię</th>
                  <th>Osiedle</th>
                </tr>
                </thead>
                <tbody class="table-body">
                <tr :key="index" v-for="(item, index) in results.players" @click="$router.push(`/players/${item.id}`)" :aria-label="item.name" :title="item.name">
                  <th>{{ index + 1 }}</th>
                  <th>{{ item.name }}</th>
                  <th>{{ item.settlement }}</th>
                </tr>
                </tbody>
              </table>
            </div>
            <div class="search-data-item" :key="1" v-if="visibleTab === 1 && results.settlements">
              <p class="no-results" v-if="results.settlements.length <= 0">Brak wyników</p>
              <table v-if="results.settlements.length > 0" class="table-panel search-table">
                <thead>
                <tr>
                  <th>lp.</th>
                  <th>Nazwa osiedla</th>
                </tr>
                </thead>
                <tbody>
                <tr :key="index" v-for="(item, index) in results.settlements" @click="$router.push(`/settlements/${item.id}`)" :aria-label="item.name" :title="item.name">
                  <th>{{ index + 1 }}</th>
                  <th>{{ item.name }}</th>
                </tr>
                </tbody>
              </table>
            </div>
            <div class="search-data-item" v-if="visibleTab === 2 && results.events" :key="2" >
              <p class="no-results" v-if="results.events.length <= 0">Brak wyników</p>
              <table v-if="results.events.length > 0" class="table-panel search-table">
                <thead>
                <tr>
                  <th>lp.</th>
                  <th>Nazwa</th>
                  <th>Data</th>
                </tr>
                </thead>
                <tbody>
                <tr :key="index" v-for="(item, index) in results.events" @click="$router.push(`/events/${item.id}`)" :aria-label="item.name" :title="item.name">
                  <th>{{ index + 1 }}</th>
                  <th>{{ item.name }}</th>
                  <th>{{ item.date }}</th>
                </tr>
                </tbody>
              </table>
            </div>
            <div class="search-data-item" v-if="visibleTab === 3 && results.newses" :key="3">
              <p class="no-results" v-if="results.newses.length <= 0">Brak wyników</p>
              <table v-if="results.newses.length > 0" class="table-panel search-table" >
                <thead>
                <tr>
                  <th>lp.</th>
                  <th>Nazwa</th>
                  <th>Data</th>
                </tr>
                </thead>
                <tbody>
                <tr :key="index" v-for="(item, index) in results.newses" @click="$router.push(`/news/${item.id}`)" :aria-label="item.name" :title="item.name">
                  <th>{{ index + 1 }}</th>
                  <th>{{ item.name }}</th>
                  <th>{{ item.date }}</th>
                </tr>
                </tbody>
              </table>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </main>
</template>

<script>

export default {
  props: ['phrase'],
  name: "SearchResults",
  data() {
    return {
      visibleTab: 0
    };
  },
  methods: {
    switchVisible(tab) {
      this.visibleTab = tab;
    }
  },
  computed: {
    results() {
      return this.$store.getters.search;
    }
  },
  created(){
    this.$store.dispatch("search", this.phrase);
  },
  updated(){
    this.$store.dispatch("search", this.phrase);
  }
}

</script>

<style scoped lang="scss" src="./SearchResults.scss" />
