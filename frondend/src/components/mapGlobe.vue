<template>
  <div class="main-container">
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
          <a href="/stats" @click="closeMenu">Game Stats </a>
        </div>
      </div>
    </nav>

    <!-- Contenedor del mapa -->
    <div ref="mapContainer" class="map-container"></div>

    <!-- Formulario emergente -->
    <div v-if="showForm" class="form-overlay">
      <div class="form-container">
        <h2>Agregar Nuevo Pin</h2>
        <form @submit.prevent="submitPin">
          <div class="form-group">
            <label for="username">Nombre de usuario:</label>
            <input id="username" v-model="formData.username" required>
          </div>
          <div class="form-group">
            <label for="game">Juego:</label>
            <input id="game" v-model="formData.game" required>
          </div>
          <div class="form-group">
            <label for="note">Nota (opcional):</label>
            <textarea id="note" v-model="formData.note"></textarea>
          </div>
          <div class="form-actions">
            <button type="button" @click="cancelForm">Cancelar</button>
            <button type="submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">

import { ref, onMounted } from 'vue'
import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'
import axios from 'axios'

// Configuración
mapboxgl.accessToken = 'pk.eyJ1IjoianVhbmVzNzgiLCJhIjoiY21id2xycnhrMTFvazJscTFidGFod2JwZiJ9.2d50Rw2voOOdpAg6GtoHAA'

// Estados
const mapContainer = ref<HTMLElement | null>(null)
const isNavCollapsed = ref(false)
const menuExpanded = ref(false)
const map = ref<mapboxgl.Map | null>(null)
const showForm = ref(false)
const formData = ref({
  username: '',
  game: '',
  note: '',
  lat: 0,
  lng: 0
})

// Funciones del menú
const toggleMenu = () => menuExpanded.value = !menuExpanded.value
const closeMenu = () => menuExpanded.value = false

// Funciones del formulario
const cancelForm = () => {
  showForm.value = false
  formData.value = { username: '', game: '', note: '', lat: 0, lng: 0 }
}

const submitPin = async () => {
  try {
    const { username, game, note, lat, lng } = formData.value
    await axios.post('http://localhost:8000/api/pins', { username, game, note, lat, lng })
    
    // Agregar el nuevo marcador al mapa
    const marker = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(map.value!)
    
    // Configurar popup para el nuevo marcador
    marker.setPopup(
      new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="popup-content">
            <h3>${game}</h3>
            <p>${note || 'Sin nota'}</p>
            <small>Publicado por: ${username}</small>
          </div>
        `)
    )
    
    // Agregar evento específico al marcador
    marker.getElement().addEventListener('click', (e) => {
      e.stopPropagation()
      marker.togglePopup()
    })
    
    cancelForm()
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  if (!mapContainer.value) return

  // Inicializar mapa
  map.value = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-74.5, 40],
    zoom: 1,
    projection: 'globe'


  })



  // Configuración visual
  map.value.on('style.load', () => {
    map.value?.setFog({
      color: 'rgb(186, 210, 235)',
      'high-color': 'rgb(36, 92, 223)',
      'horizon-blend': 0.02,
      'space-color': 'rgb(11, 11, 25)',
      'star-intensity': 0.6
    })
  })

  // Controlador de zoom
  map.value.on('zoom', () => {
    if (!map.value) return
    const currentZoom = map.value.getZoom()
    isNavCollapsed.value = currentZoom > 1.2
  })

  // Cargar marcadores existentes
  try {
    const response = await axios.get('http://localhost:8000/api/pins')
    response.data.forEach((pin: any) => {
      const marker = new mapboxgl.Marker()
        .setLngLat([pin.lng, pin.lat])
        .addTo(map.value!)
      
      // Configurar popup para el marcador
      marker.setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div class="popup-content">
              <h3>${pin.game}</h3>
              <p>${pin.note || 'Sin nota'}</p>
              <small>Publicado por: ${pin.username}</small>
            </div>
          `)
      )
      
      // Agregar evento al marcador
      marker.getElement().addEventListener('click', (e) => {
        e.stopPropagation()
        marker.togglePopup()
      })
    })
  } catch (error) {
    console.error('Error al cargar pins:', error)
  }

  // Manejo de clicks en el mapa (solo para tierra)
  map.value.on('click', async (e) => {
    if (!map.value) return
    
    // Verificar si el click fue en un marcador
    const target = e.originalEvent.target as HTMLElement
    if (target.closest('.mapboxgl-marker')) {
      return // Es un click en marcador, no hacer nada
    }
    
    // Verificar si es tierra
    const features = map.value.queryRenderedFeatures(e.point)
    const isLand = features.some(feat => 
      !(feat.layer?.id?.includes('water') || 
       (feat.layer?.type === 'fill' && feat.sourceLayer === 'water'))
    )

    if (!isLand) return

    // Mostrar formulario solo para clicks en tierra
    formData.value.lat = e.lngLat.lat
    formData.value.lng = e.lngLat.lng
    showForm.value = true
  })
})
</script>

<style scoped>

.main-container {
  position: relative;
  width: 100vw;
  height: 100vh;
}

/* Estilos del navbar (se mantienen igual) */
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
  gap: 2.5rem;
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

.map-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}


/* Estilos del formulario emergente */
.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.534);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.form-container h2 {
  margin: 0 0 1rem 0;
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  font-size: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.25rem;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  font-size: 0.875rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.375rem;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  font-size: 0.875rem;
}

.form-group textarea {
  min-height: 60px;
  background: rgba(255, 255, 255, 0.8);
}

.form-actions button {
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.form-actions button[type="button"] {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.form-actions button[type="submit"] {
  background: rgba(59, 130, 246, 0.8);
  color: white;
  border: none;
}

.form-actions button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}


/* Estilos para los popups */
.popup-content {
  max-width: 200px;
}

.popup-content h3 {
  margin: 0 0 0.5rem 0;
  color: #1e40af;
}

.popup-content p {
  margin: 0 0 0.5rem 0;
  color: #334155;
}

.popup-content small {
  color: #64748b;
  font-style: italic;
}
</style>