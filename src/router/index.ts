import { createRouter, createWebHistory } from 'vue-router'
import RedzonesListView from '@/views/RedzonesListView.vue'
import RedzonesFormView from '@/views/RedzonesFormView.vue'
import DashboardView from '@/views/DashboardView.vue'
import AreaListView from '@/views/AreaListView.vue'
import AreaFormView from '@/views/AreaFormView.vue'
import LoginView from '@/views/LoginView.vue'
import ChangePasswordView from '@/views/ChangePasswordView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DashboardView
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
    {
      path: '/redzones/update/:id',
      name: 'update redzone',
      component: RedzonesFormView
    },
    {
      path: '/area/create',
      name: 'create area',
      component: AreaFormView,
    },
    {
      path: '/area',
      name: 'area',
      component: AreaListView,
    },
    {
      path: '/area/update/:id',
      name: 'update area',
      component: AreaFormView
    },
    {
      path: '/auth',
      name: 'login',
      component: LoginView
    },
    {
      path: '/change-password',
      name: 'change password',
      component: ChangePasswordView
    },
  ]
})

export default router
