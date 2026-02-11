import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'catalog',
      component: HomeView,
    },
    {
      path: '/register',
      name: 'register',
      // component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/auth',
      name: 'auth',
      // component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      // component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/orders',
      name: 'orders',
      // component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/logout',
      name: 'logout',
      // component: () => import('../views/AboutView.vue'),
    },

  ],
})

export default router
