import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import RedzonesListView from '@/views/RedzonesListView.vue'
import RedzonesFormView from '@/views/RedzonesFormView.vue'

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
      component: RedzonesListView,
    },
    {
      path: '/redzones/create',
      name: 'create redzone',
      component: RedzonesFormView
    },
  ]
})

export default router
