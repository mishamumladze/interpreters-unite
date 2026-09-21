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
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/tools',
      name: 'Tools',
      component: () => import('../views/ToolsView.vue'),
    },
    {
      path: '/tools/scripts',
      name: 'scripts',
      component: () => import('../views/tools/ScriptsView.vue'),
    },
    {
      path: '/tools/discord',
      name: 'discord',
      component: () => import('../views/tools/DiscordView.vue'),
    },
  ],
})

export default router
