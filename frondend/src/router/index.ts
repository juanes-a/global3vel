import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/mapGlobe.vue' 
import aboutUs from '../view/aboutUs.vue' // Importa tu componente de "Sobre nosotros"
import gameStats from '../view/gameStats.vue' // Importa tu componente de estadísticas del juego


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView // Tu componente con el globo terráqueo
  },
  {
    path: '/about',
    name: 'about',
    component: aboutUs
  },
  {
    path: '/stats',
    name: 'stats',
    component: gameStats
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router