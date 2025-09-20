import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

import DashboardLayout from '@/layouts/DashboardLayout.vue'
import HomeView from '@/views/dashboard/HomeView.vue'

import type { RouteLocationNormalized, NavigationGuardNext, RouteRecordRaw } from 'vue-router'

// Define routes
const routes: RouteRecordRaw[] = [
  // Error
  {
    path: '/error/:code?',
    name: 'error',
    meta: { title: 'Error', requiresAuth: false },
    component: () => import('../layouts/ErrorLayout.vue'),
    children: [
      {
        path: '',
        name: 'error-page',
        meta: { title: 'Error', requiresAuth: false },
        component: () => import('../views/ErrorView.vue'),
      },
    ],
  },
  // 404 Not Found
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    meta: { title: 'Not Found', requiresAuth: false },
    redirect: '/error/404',
  },
  // Auth
  {
    path: '/auth',
    name: 'auth',
    meta: { title: 'Authentication', requiresAuth: false },
    component: () => import('../layouts/AuthLayout.vue'),
    redirect: { name: 'login' },
    children: [
      {
        path: 'register',
        name: 'register',
        meta: { title: 'Register', requiresAuth: false },
        component: () => import('../views/auth/RegisterView.vue'),
      },
      {
        path: 'login',
        name: 'login',
        meta: { title: 'Login', requiresAuth: false },
        component: () => import('../views/auth/LoginView.vue'),
      },
    ],
  },
  // Dashboard
  {
    path: '/',
    name: 'dashboard',
    meta: { title: 'Dashboard', requiresAuth: false },
    component: DashboardLayout,
    redirect: { name: 'home' },
    children: [
      {
        path: 'home',
        name: 'home',
        meta: { title: 'Dashboard', requiresAuth: false },
        component: HomeView,
      },
      {
        path: 'user',
        name: 'user',
        meta: { title: 'User Management', requiresAuth: true },
        component: () => import('../views/dashboard/UserView.vue'),
      },
      {
        path: 'products',
        name: 'products',
        meta: { title: 'Products', requiresAuth: false },
        component: () => import('../views/dashboard/ProductsView.vue'),
      },
      {
        path: 'products/:productUuid',
        name: 'product-detail',
        meta: { title: 'Product Detail', requiresAuth: false },
        component: () => import('../views/dashboard/ProductDetailView.vue'),
      },
      {
        path: 'cart',
        name: 'cart',
        meta: { title: 'User Cart', requiresAuth: true },
        component: () => import('../views/dashboard/CartView.vue'),
      },
      {
        path: 'order',
        name: 'order',
        meta: { title: 'User Order', requiresAuth: true },
        component: () => import('../views/dashboard/OrderView.vue'),
      },
    ],
  },
]

// Create router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

// Navigation Guards
router.beforeEach(
  async (
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) => {
    const userStore = useUserStore()

    if (!userStore.isInitialized) {
      await userStore.initializeAuth()
    }

    if (!userStore.isAuthenticated) {
      if (to.meta?.requiresAuth) {
        return next({ name: 'login' })
      }

      return next()
    } else {
      if (to.path.startsWith('/auth')) {
        return next({ name: 'home' })
      }

      return next()
    }
  },
)

export default router
