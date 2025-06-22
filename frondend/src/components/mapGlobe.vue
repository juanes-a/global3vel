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
          <router-link to="/" @click="closeMenu">Home</router-link>
          <router-link to="/about" @click="closeMenu">About Us</router-link>
          <router-link to="/stats" @click="closeMenu">Game Stats</router-link>
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

// En tu <script setup>
onMounted(() => {
  console.log('Variable de entorno:', import.meta.env.VITE_API_URL)
})
// Configuración - IMPORTANTE: URL exacta del backend
const API_BASE_URL = 'https://global3vel-4cb4709e6ed0.herokuapp.com'

mapboxgl.accessToken = 'pk.eyJ1IjoianVhbmVzNzgiLCJhIjoiY21id2xycnhrMTFvazJscTFidGFod2JwZiJ9.2d50Rw2voOOdpAg6GtoHAA'

// Configuración global de Axios para CORS
axios.defaults.baseURL = API_BASE_URL
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['Content-Type'] = 'application/json'

// Estados (permanecen igual)
const mapContainer = ref<HTMLElement | null>(null)
const isNavCollapsed = ref(false)
const menuExpanded = ref(false)
const map = ref<mapboxgl.Map>({} as mapboxgl.Map)
const showForm = ref(false)
const formData = ref({
  username: '',
  game: '',
  note: '',
  lat: 0,
  lng: 0
})

interface Pin {
  id: number
  username: string
  game: string
  note?: string
  lat: number | string
  lng: number | string
  created_at?: string
  updated_at?: string
}

// Funciones del menú (permanecen igual)
const toggleMenu = () => menuExpanded.value = !menuExpanded.value
const closeMenu = () => menuExpanded.value = false

// Funciones del formulario - MODIFICADAS para manejar CORS
const cancelForm = () => {
  showForm.value = false
  formData.value = { username: '', game: '', note: '', lat: 0, lng: 0 }
}

const submitPin = async () => {
  try {
    const { username, game, note, lat, lng } = formData.value
    
    // Enviar pin con headers explícitos
    const response = await axios.post('/api/pins', { 
      username, 
      game, 
      note, 
      lat: Number(lat),
      lng: Number(lng)
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    // Agregar el nuevo marcador al mapa
    if (map.value && response.data) {
      const newPin = response.data
      createMarkerWithPopup({
        id: newPin.id,
        username: newPin.username,
        game: newPin.game,
        note: newPin.note,
        lat: Number(newPin.lat),
        lng: Number(newPin.lng)
      })
    }
    
    cancelForm()
  } catch (error) {
    console.error('Error al enviar pin:', error)
    // Manejo de errores mejorado
    if (axios.isAxiosError(error)) {
      console.error('Detalles del error:', {
        message: error.message,
        code: error.code,
        response: error.response?.data
      })
    }
  }
}

const createMarkerWithPopup = (pin: Pin) => {
  if (!map.value) return
  
  // Convertir coordenadas a números si son strings
  const lat = typeof pin.lat === 'string' ? parseFloat(pin.lat) : pin.lat
  const lng = typeof pin.lng === 'string' ? parseFloat(pin.lng) : pin.lng

  const marker = new mapboxgl.Marker()
    .setLngLat([lng, lat])
    .addTo(map.value)
  
  marker.setPopup(
    new mapboxgl.Popup({ offset: 25 })
      .setHTML(`
        <div class="popup-content">
          <h3>${pin.game}</h3>
          <p>${pin.note || 'Sin nota'}</p>
          <small>Publicado por: ${pin.username}</small>
          ${pin.created_at ? `<small>Creado: ${new Date(pin.created_at).toLocaleString()}</small>` : ''}
        </div>
      `)
  )
  
  const markerElement = marker.getElement()
  if (markerElement) {
    markerElement.addEventListener('click', (e) => {
      e.stopPropagation()
      marker.togglePopup()
    })
  }
}

onMounted(async () => {
  if (!mapContainer.value) return

  // Inicializar mapa (igual)
  map.value = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [-74.5, 40],
    zoom: 1,
    projection: 'globe' as any
  }) as unknown as mapboxgl.Map

  // Configuración visual (igual)
  map.value.on('style.load', () => {
    map.value?.setFog({
      color: 'rgb(186, 210, 235)',
      'high-color': 'rgb(36, 92, 223)',
      'horizon-blend': 0.02,
      'space-color': 'rgb(11, 11, 25)',
      'star-intensity': 0.6
    } as any)
  })

  // Controlador de zoom (igual)
  map.value.on('zoom', () => {
    if (!map.value) return
    isNavCollapsed.value = map.value.getZoom() > 1.2
  })

  // Cargar marcadores existentes - MODIFICADO para mejor manejo de errores
  try {
    const response = await axios.get<Pin[]>('/api/pins', {
      headers: {
        'Accept': 'application/json'
      }
    })
    
    response.data.forEach(pin => {
      createMarkerWithPopup({
        ...pin,
        lat: Number(pin.lat),
        lng: Number(pin.lng)
      })
    })
  } catch (error) {
    console.error('Error al cargar pins:', error)
    if (axios.isAxiosError(error)) {
      console.error('Detalles del error CORS:', {
        config: error.config,
        response: error.response
      })
    }
  }

  // Manejo de clicks en el mapa (igual)
  map.value.on('click', async (e) => {
    if (!map.value) return
    
    const target = e.originalEvent.target as HTMLElement
    if (target.closest('.mapboxgl-marker')) return
    
    const features = map.value.queryRenderedFeatures(e.point)
    const isLand = features.some(feat => 
      !(feat.layer?.id?.includes('water') || 
      (feat.layer?.type === 'fill' && feat.sourceLayer === 'water'))
    )

    if (!isLand) return

    formData.value.lat = e.lngLat.lat
    formData.value.lng = e.lngLat.lng
    showForm.value = true
  })
})


// Exponer las variables que necesita el template
defineExpose({
  mapContainer,
  showForm,
  formData,
  isNavCollapsed,
  menuExpanded,
  toggleMenu,
  closeMenu,
  submitPin,
  cancelForm
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

.nav-links router-link {
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.9rem;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;
  white-space: nowrap;
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

.nav-links router-link:hover {
  color: #38bdf8;
}

.nav-links router-link.router-link-active {
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