<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
import NavBar from './components/UI/NavbarUI.vue'
import Footer from './components/UI/FooterUI.vue'
</script>

<template>
  <NavBar />
  <main class="pb-24 md:pb-0"><RouterView /></main>
  <Footer />
</template>
