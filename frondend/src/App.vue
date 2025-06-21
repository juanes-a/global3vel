<script setup lang="ts">
import { computed } from 'vue' // Esto viene de Vue
import { useRoute } from 'vue-router' // Esto viene de Vue Router
import NavBar from './components/NavBar.vue'

const route = useRoute()
const showNavBar = computed(() => route.name !== 'home')
</script>

<template>
  <NavBar v-if="showNavBar" />
  <router-view />
</template>