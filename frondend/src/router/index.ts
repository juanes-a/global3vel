import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/mapGlobe.vue'
import aboutUs from '../view/aboutUs.vue' // Cambié 'view' por 'views'
import gameStats from '../view/gameStats.vue' // Cambié 'view' por 'views'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: aboutUs,
       meta: {
        contentType: 'text/html'  // Header explícito
      }
    },
    {
      path: '/stats',
      name: 'stats',
      component: gameStats
    },
    // Ruta de fallback para SPA
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router