import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RedzonesListView from '@/views/RedzonesListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/redzones',
      name: 'redzones',
      component: RedzonesListView
    },
  ]
})

export default router
