<template>
  <nav class="navigation">
    <section class="navigation-left">
      <!-- <a role="button" @click="toggleMenu" class="navbar-burger" :class="{'is-active': menu}" aria-control="menu" aria-label="Menu" :aria-expanded="menu ? 'true' : ''">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a> -->
      <figure class="navigation-logo">
        <router-link to="/panel/" aria-label="Open panel homepage">
          <img src="@/Assets/logo.jpg" alt="Liga sportowa gminy Władysławowo"/>
        </router-link>
      </figure>
      <div @keyup.enter="search()" class="navigation-search control has-icons-right">
        <input class="input" type="text" v-model="searchValue" placeholder="Wyszukaj w panelu..." aria-label="Wyszukaj w panelu">
        <svg @click="search()" class="navigation-search-btn" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 512 512">
          <g>
            <path d="M495,466.2L377.2,348.4c29.2-35.6,46.8-81.2,46.8-130.9C424,103.5,331.5,11,217.5,11C103.4,11,11,103.5,11,217.5   S103.4,424,217.5,424c49.7,0,95.2-17.5,130.8-46.7L466.1,495c8,8,20.9,8,28.9,0C503,487.1,503,474.1,495,466.2z M217.5,382.9   C126.2,382.9,52,308.7,52,217.5S126.2,52,217.5,52C308.7,52,383,126.3,383,217.5S308.7,382.9,217.5,382.9z"/>
          </g>
        </svg>
      </div>
    </section>
    <section class="navigation-right">
      <div class="navigation-panel">
        <!-- <p class="navigation-panel-user">{{user.email}}</p> -->
        <button @click="logout" class="navigation-panel-logout" type="button" aria-label="Wyloguj się" title="Wyloguj się">
          <svg enable-background="new 0 0 512 512" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
            <path d="m320 73.294v67.979c18.104 7.902 34.75 19.204 49.137 33.59 30.22 30.22 46.863 70.4 46.863 113.14 0 42.736-16.643 82.917-46.863 113.14-30.221 30.22-70.399 46.863-113.14 46.863s-82.917-16.643-113.14-46.863-46.863-70.401-46.863-113.14c0-42.737 16.643-82.917 46.863-113.14 14.387-14.387 31.034-25.689 49.137-33.591v-67.978c-92.524 27.54-160 113.24-160 214.71 0 123.71 100.29 224 224 224 123.71 0 224-100.29 224-224 0-101.47-67.475-187.17-160-214.71zm-96-73.294h64v256h-64v-256z"/>
          </svg>
        </button>
      </div>
    </section>
  </nav>
</template>

<script>

// import { mapGetters } from "vuex"

export default {
  name: "Navigation",
  data() {
    return {
      searchValue: ""
    }
  },
  methods: {
    toggleMenu: function() {
      this.$store.dispatch("toggleMenu");
    },
    logout: function() {
      this.$store.dispatch("logout");
    },
    search: function() {
      if (this.searchValue.length > 0) {
        this.$router.push({name: 'SearchDashboard', params: {phrase: this.searchValue}});
      }
    }
  },
  // computed: {
  //   ...mapGetters([
  //     "menu",
  //     "user"
  //   ])
  // }
}

</script>

<style lang="scss" src="./Navigation.scss" scoped />