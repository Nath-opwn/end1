import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/boat-drifting',
    name: 'boatDrifting',
    component: () => import('../views/SimulationView.vue'),
    meta: { requiresAuth: true },
    props: { simulationType: 'boat-drifting' }
  },
  {
    path: '/simulation',
    name: 'simulation',
    component: () => import('../views/SimulationView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/lab',
    name: 'lab',
    component: () => import('../views/LabView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router 