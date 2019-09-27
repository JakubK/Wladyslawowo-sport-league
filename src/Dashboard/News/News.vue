<template>
  <div>
    <header class="panel-header">
      <h1 class="panel-header-title title is-3">Wydarzenia</h1>
      <div class="panel-header-link">
        <router-link class="button is-danger" to="/panel/news/add-news">Dodaj wydarzenie</router-link>
      </div>
    </header>
    <section class="">
      <div class="table-responsive">
        <table class="table-panel">
          <thead>
          <tr>
            <th>lp.</th>
            <th>Nazwa wydarzenia</th>
            <th>Data</th>
            <th>Edycja</th>
          </tr>
          </thead>
          <transition-group tag="tbody" name="fade">
            <tr v-for="(news, index) in newses" :key="index">
              <th>{{index}}</th>
              <th>{{news.name}}</th>
              <th>{{news.date}}</th>
              <th>
                <div class="table-panel-buttons">
                  <button class="button" type="button" @click="updateNews(news)" aria-label="Edytuj" title="Edytuj">
                    <svg aria-hidden="true"  data-prefix="fas" data-icon="cog" class="edit svg-inline--fa fa-cog fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M444.788 291.1l42.616 24.599c4.867 2.809 7.126 8.618 5.459 13.985-11.07 35.642-29.97 67.842-54.689 94.586a12.016 12.016 0 0 1-14.832 2.254l-42.584-24.595a191.577 191.577 0 0 1-60.759 35.13v49.182a12.01 12.01 0 0 1-9.377 11.718c-34.956 7.85-72.499 8.256-109.219.007-5.49-1.233-9.403-6.096-9.403-11.723v-49.184a191.555 191.555 0 0 1-60.759-35.13l-42.584 24.595a12.016 12.016 0 0 1-14.832-2.254c-24.718-26.744-43.619-58.944-54.689-94.586-1.667-5.366.592-11.175 5.459-13.985L67.212 291.1a193.48 193.48 0 0 1 0-70.199l-42.616-24.599c-4.867-2.809-7.126-8.618-5.459-13.985 11.07-35.642 29.97-67.842 54.689-94.586a12.016 12.016 0 0 1 14.832-2.254l42.584 24.595a191.577 191.577 0 0 1 60.759-35.13V25.759a12.01 12.01 0 0 1 9.377-11.718c34.956-7.85 72.499-8.256 109.219-.007 5.49 1.233 9.403 6.096 9.403 11.723v49.184a191.555 191.555 0 0 1 60.759 35.13l42.584-24.595a12.016 12.016 0 0 1 14.832 2.254c24.718 26.744 43.619 58.944 54.689 94.586 1.667 5.366-.592 11.175-5.459 13.985L444.788 220.9a193.485 193.485 0 0 1 0 70.2zM336 256c0-44.112-35.888-80-80-80s-80 35.888-80 80 35.888 80 80 80 80-35.888 80-80z"></path></svg>
                  </button>
                  <button class="button" type="button" @click="removeNews(news)" aria-label="Usuń" title="Usuń">
                    <svg aria-hidden="true"  data-prefix="far" data-icon="trash-alt" class="remove svg-inline--fa fa-trash-alt fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M192 188v216c0 6.627-5.373 12-12 12h-24c-6.627 0-12-5.373-12-12V188c0-6.627 5.373-12 12-12h24c6.627 0 12 5.373 12 12zm100-12h-24c-6.627 0-12 5.373-12 12v216c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12V188c0-6.627-5.373-12-12-12zm132-96c13.255 0 24 10.745 24 24v12c0 6.627-5.373 12-12 12h-20v336c0 26.51-21.49 48-48 48H80c-26.51 0-48-21.49-48-48V128H12c-6.627 0-12-5.373-12-12v-12c0-13.255 10.745-24 24-24h74.411l34.018-56.696A48 48 0 0 1 173.589 0h100.823a48 48 0 0 1 41.16 23.304L349.589 80H424zm-269.611 0h139.223L276.16 50.913A6 6 0 0 0 271.015 48h-94.028a6 6 0 0 0-5.145 2.913L154.389 80zM368 128H80v330a6 6 0 0 0 6 6h276a6 6 0 0 0 6-6V128z"></path></svg>
                  </button>
                </div>
              </th>
            </tr>
          </transition-group>
        </table>
      </div>
      <div class="table-pagination">
        <button class="button" @click="previous">Poprzednia</button>
        <p class="table-pagination-counter">{{currentPage}} z {{pages}}</p>
        <button class="button" @click="next">Następna</button>
      </div>
    </section>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "News",
  data() {
    return {
      currentPage: 1,
      pageSize: 8,
    }
  },
  computed: {
    newses(){
      return this.$store.getters.dashboardNewses;
    },
    pages() {
      return Math.ceil(this.newses.length / this.pageSize);
    }
  },
  created()
  {
    this.$store.dispatch("dashboardNewses");
  },
  methods: {
    removeNews(news) {
      this.$store.dispatch('removeNews',news);
    },
    updateNews(news) {
      this.$router.push({name: 'UpdateNews', params: {id: news.id}});
    },
    next() {
      if ((this.currentPage * this.pageSize) < this.newses.length) {
        this.currentPage++;
      }
    },
    previous() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  }
}

</script>