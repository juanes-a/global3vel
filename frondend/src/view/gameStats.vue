<template>
  <NavBar :isNavCollapsed="false" />
  <div class="container">
    <h1>WILD ARCADE TRACKER</h1>
    <div class="subtitle">Track by game, territory or den...</div>
    
    <div class="tracker-stats">
      <div class="stat-line">
        <span class="stat-label">SCENT:</span>
        <span class="stat-value">FRESH</span>
      </div>
      <div class="stat-line">
        <span class="stat-label">PREY:</span>
        <span class="stat-value">{{ filteredPins.length }}</span>
      </div>
    </div>
    
    <div class="divider"></div>
    
    <h2 v-if="filteredPins.length === 0">HIBERNATION MODE</h2>
    <h2 v-else>ACTIVE TRACKS</h2>
    
    <div class="no-tracks" v-if="filteredPins.length === 0">
      No tracks found in this territory
    </div>
    
    <ul class="track-list" v-else>
      <li v-for="pin in filteredPins" :key="pin.id" class="track-item">
        <div class="track-header">
          <span class="track-id">ID: {{ Math.floor(Math.random() * 9000) + 1000 }}</span>
          <strong class="game-name">{{ pin.game }}</strong>
        </div>
        
        <div class="track-content">
          <p><span class="label">NOTE:</span> {{ pin.note || 'No note' }}</p>
          <p><span class="label">USER:</span> {{ pin.username }}</p>
          <p><span class="label">LOCATION:</span> 
            {{ pin.location?.city || 'Unknown' }}, 
            {{ pin.location?.country || 'Unknown' }}
          </p>
          <p><span class="label">COORDINATES:</span> 
            {{ pin.lat ? Number(pin.lat).toFixed(4) : 'N/A' }}, 
            {{ pin.lng ? Number(pin.lng).toFixed(4) : 'N/A' }}
          </p>
        </div>
      </li>
    </ul>
    
    <button class="hunt-again" @click="resetSearch">HUNT AGAIN?</button>
    
    <div class="particles">
      <div v-for="i in 30" :key="i" class="particle" :style="particleStyle(i)"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import NavBar from '../components/NavBar.vue'

const MAPBOX_TOKEN = 'pk.eyJ1IjoianVhbmVzNzgiLCJhIjoiY21id2xycnhrMTFvazJscTFidGFod2JwZiJ9.2d50Rw2voOOdpAg6GtoHAA'

const pins = ref<any[]>([])
const filteredPins = ref<any[]>([])
const searchText = ref('')

async function reverseGeocode(lat: number | undefined, lng: number | undefined) {
  if (!lat || !lng) return { country: null, city: null }
  
  try {
    const res = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`)
    const features = res.data.features

    const country = features.find((f: any) => f.place_type.includes('country'))?.text
    const city = features.find((f: any) => f.place_type.includes('place') || f.place_type.includes('locality'))?.text

    return { country, city }
  } catch {
    return { country: null, city: null }
  }
}

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/pins')
    const loadedPins = response.data

    for (const pin of loadedPins) {
      pin.location = await reverseGeocode(pin.lat, pin.lng)
    }

    pins.value = loadedPins
    filteredPins.value = loadedPins
  } catch (error) {
    console.error('❌ Error tracking prey:', error)
    filteredPins.value = []
  }
})

function applyFilter() {
  const q = searchText.value.trim().toLowerCase()
  if (!q) {
    filteredPins.value = pins.value
  } else {
    filteredPins.value = pins.value.filter(pin => {
      const country = pin.location?.country?.toLowerCase() || ''
      const city = pin.location?.city?.toLowerCase() || ''
      const game = pin.game?.toLowerCase() || ''
      
      return game.includes(q) || country.includes(q) || city.includes(q)
    })
  }
}

function resetSearch() {
  searchText.value = ''
  applyFilter()
}

function particleStyle(i: number) {
  const colors = ['#003d66', '#005a8c', '#007acc', '#004080']
  const size = Math.random() * 2 + 1
  const color = colors[Math.floor(Math.random() * colors.length)]
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    backgroundColor: color,
    animation: `move${Math.floor(Math.random() * 3) + 1} ${Math.random() * 10 + 10}s linear infinite`
  }
}
</script>

<style>
/* Fondo global negro */
body, html {
  background-color: #000 !important;
  margin-top: 50px;
  padding: 0;
  height: 100%;
}
</style>

<style scoped>
.container {
  font-family: 'Orbitron', sans-serif;
  background-color: rgba(0, 10, 20, 0.7);
  color: #007acc;
  margin: 39px auto 0;
  margin-top: 70px;
  padding: 30px;
  max-width: 800px;
  border: 2px solid #007acc;
  box-shadow: 0 0 20px #005a8c, 0 0 40px #003d66;
  position: relative;
  overflow: hidden;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(0, 80, 120, 0.15) 0%, transparent 30%),
    radial-gradient(circle at 80% 70%, rgba(0, 150, 200, 0.15) 0%, transparent 30%);
}

.container::before {
  content: "";
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border: 1px solid #007acc;
  animation: pulse 4s infinite alternate;
  pointer-events: none;
}

@keyframes pulse {
  0% { opacity: 0.3; }
  100% { opacity: 0.8; }
}

h1 {
  color: #007acc;
  font-size: 2.5rem;
  margin: 0 0 10px 0;
  text-shadow: 0 0 10px #005a8c, 0 0 20px #003d66;
  letter-spacing: 3px;
  text-transform: uppercase;
  position: relative;
  display: inline-block;
}

h1::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #007acc, transparent);
  box-shadow: 0 0 10px #005a8c;
}

.subtitle {
  color: #4d9fcc;
  font-style: italic;
  margin-bottom: 30px;
  font-size: 1.1rem;
  text-shadow: 0 0 5px #005a8c;
}

.tracker-stats {
  margin: 30px 0;
  font-size: 1.3rem;
}

.stat-line {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.stat-label {
  color: #007acc;
  font-weight: bold;
  margin-right: 15px;
  min-width: 100px;
}

.stat-value {
  color: #4d9fcc;
  text-shadow: 0 0 5px #005a8c;
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #007acc, transparent);
  margin: 40px 0;
  box-shadow: 0 0 10px #005a8c;
}

h2 {
  color: #007acc;
  font-size: 1.8rem;
  margin-bottom: 25px;
  text-shadow: 0 0 10px #005a8c;
  letter-spacing: 2px;
  position: relative;
}

h2::before {
  content: "◢";
  margin-right: 10px;
  color: #005a8c;
}

.no-tracks {
  margin: 30px 0;
  color: #4d9fcc;
  font-style: italic;
  font-size: 1.2rem;
  text-align: center;
  padding: 15px;
  border: 1px dashed #005a8c;
  background-color: rgba(0, 25, 40, 0.4);
}

.track-list {
  list-style: none;
  padding: 0;
  margin: 30px 0;
}

.track-item {
  margin-bottom: 25px;
  border: 1px solid #005a8c;
  padding: 15px;
  background-color: rgba(0, 15, 30, 0.5);
  position: relative;
  overflow: hidden;
}

.track-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 90, 140, 0.1),
    transparent
  );
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.track-item:hover::before {
  transform: translateX(100%);
}

.track-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #005a8c;
}

.track-id {
  color: #007acc;
  font-size: 0.9rem;
  opacity: 0.7;
}

.game-name {
  color: #4d9fcc;
  font-size: 1.3rem;
  text-shadow: 0 0 5px #005a8c;
}

.track-content {
  color: #4d9fcc;
  font-size: 0.95rem;
  line-height: 1.6;
}

.track-content p {
  margin: 8px 0;
}

.label {
  color: #007acc;
  font-weight: bold;
  margin-right: 5px;
}

.hunt-again {
  display: inline-block;
  margin-top: 30px;
  padding: 12px 25px;
  background: linear-gradient(135deg, #003d66, #005a8c);
  color: #000;
  font-weight: bold;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 0 15px #003d66;
  position: relative;
  overflow: hidden;
  font-family: 'Orbitron', sans-serif;
}

.hunt-again:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 25px #005a8c;
}

.hunt-again::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    transparent 45%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 55%
  );
  transform: rotate(30deg);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% { transform: translateX(-100%) rotate(30deg); }
  100% { transform: translateX(100%) rotate(30deg); }
}

.particle {
  position: absolute;
  background-color: #005a8c;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0.6;
}

@keyframes move1 {
  0% { transform: translate(0, 0); }
  100% { transform: translate(30px, -20px); }
}

@keyframes move2 {
  0% { transform: translate(0, 0); }
  100% { transform: translate(-40px, 15px); }
}

@keyframes move3 {
  0% { transform: translate(0, 0); }
  100% { transform: translate(25px, 30px); }
}

@media (max-width: 768px) {
  .container {
    padding: 20px;
    margin: 39px 20px 0;
  }
  
  h1 {
    font-size: 1.8rem;
  }
  
  .tracker-stats {
    font-size: 1.1rem;
  }
  
  .game-name {
    font-size: 1.1rem;
  }
}
</style>