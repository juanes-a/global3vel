<script setup lang="ts">

import { useRouter } from 'vue-router';
const router = useRouter();

import { ref} from 'vue'
import 'mapbox-gl/dist/mapbox-gl.css'


// Props
interface NavbarProps {
  isNavCollapsed: boolean
}

const props = defineProps<NavbarProps>()

// Estados
const menuExpanded = ref(false)

// Funciones del menú
const toggleMenu = () => menuExpanded.value = !menuExpanded.value
const closeMenu = () => menuExpanded.value = false
</script>

<template>
  <!-- Barra de navegación dinámica -->
  <nav :class="['navbar', { 'collapsed': isNavCollapsed }]">
    <div class="nav-content">
      <h1 class="logo" v-show="!isNavCollapsed">GlobaL3VEL</h1>
      <button class="menu-toggle" @click="toggleMenu" v-show="isNavCollapsed">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </button>
      <div class="nav-links" :class="{ 'expanded': menuExpanded }" v-show="!isNavCollapsed || menuExpanded">
        <a href="/" @click="closeMenu">Home</a>
        <a href="/about" @click="closeMenu">About Us</a>
        <a href="/stats" @click="closeMenu">Game Stats</a>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Estilos del navbar */
.navbar {
  position: absolute;
  top: 0;
  left: 0;
  width: 95%;
  padding: 1rem 2rem;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(8px);
  z-index: 10;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
}

.navbar.collapsed {
  width: auto;
  padding: 0.5rem;
  right: 0rem;
  left: auto;
  background: rgba(15, 23, 42, 0.5);
}

.nav-content {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  color: white;
  font-size: 2rem; /* Aumenta esto si no ves diferencia (prueba 2.5rem o 3rem) */
  font-family: 'Poppins', sans-serif;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.menu-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dot {
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.navbar.collapsed .nav-links {
  position: absolute;
  top: 100%;
  right: 0;
  background: rgba(15, 23, 42, 0.9);
  padding: 1rem;
  border-radius: 0 0 0 8px;
  flex-direction: column;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: all 0.3s ease;
}

.navbar.collapsed .nav-links.expanded {
  max-height: 500px;
  opacity: 1;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.9rem; /* más grande */
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.nav-links a:hover {
  color: #38bdf8;
}
</style>