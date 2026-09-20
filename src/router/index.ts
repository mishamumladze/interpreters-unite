import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'Tbout',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/tools',
      name: 'Tools',
      component: () => import('../views/ToolsView.vue'),
    },
  ],
})

export default router
