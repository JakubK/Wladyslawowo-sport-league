<template>
  <div id="dashboard">
    <Navigation></Navigation>
    <Menu></Menu>
    <main class="panel" :class="{'is-active': menu}">
      <transition name="fade">
        <router-view></router-view>
      </transition>
    </main>
  </div>
</template>

<script>

import Navigation from "./Navigation/Navigation.vue"
import Menu from "./Menu/Menu.vue"

export default {
  name: "home",
  components: {
    Navigation,
    Menu,
  },
  computed: {
    menu() {
      return this.$store.getters.menu;
    }
  }
}

</script>

<style lang="scss" src="./Dashboard.scss"/>