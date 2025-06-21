import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/mapGlobe.vue' 


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView // Tu componente con el globo terráqueo
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../view/aboutUs.vue') // Lazy loading
  },
  {
    path: '/stats',
    name: 'stats',
    component: () => import('../view/gameStats.vue') // Lazy loading
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router