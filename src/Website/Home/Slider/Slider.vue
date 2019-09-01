<template>
  <carousel class="slider" :per-page="1" :autoplay="true" pagination-active-color="#ff3333"
  :autoplayHoverPause="true" :autoplayTimeout="3400" :loop="true"
  >
    <slide class="slider-item" v-for="news in lastNews" :key="news.id" :style="{'background-image': `url(${news.media})`}">
      <div class="slider-item-content">
        <h3 class="slider-item-content-title"><router-link :to="`news/${news.id}`" :aria-label="news.name" :title="news.name">{{news.name}}</router-link></h3>
        <p class="slider-item-content-text">{{news.description | reduceText}}</p>
      </div>
      <span class="slider-item-date">{{news.date}}</span>
    </slide>
  </carousel>
</template>

<script>

  export default {
    name: "Slider",
    props: [ "lastNews"]
  }

</script>

<style src="./Slider.scss"  />