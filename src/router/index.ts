import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import type { RouteLocationNormalized, NavigationGuardNext, RouteRecordRaw } from 'vue-router'

// Define routes
const routes: RouteRecordRaw[] = [
  //Error
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
  // 404 Not Found Route
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    meta: { title: 'Not Found', requiresAuth: false },
    redirect: '/error/404',
  },
]

// Create router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

// Navigation Guards
router.beforeEach(
  async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authStore = useAuthStore()

    // When the route does not require authentication
    if (to.meta?.requiresAuth === false) {
      return next()
    }

    const tokenIsValid = authStore.isTokenValid()
    const isAuthRoute = to.path.startsWith('/auth')

    if (!tokenIsValid) {
      return next({ name: 'login' })
    }

    /*
    When the token is valid
    */
    if (tokenIsValid && isAuthRoute) {
      return next({ name: 'home' })
    }

    if (!authStore.isAuthenticated) {
      try {
        await authStore.setAuth()
      } catch (error) {
        console.error('Authentication check failed:', error)

        authStore.clearAuth()
        return next({ name: 'login' })
      }
    }

    next()
  },
)

export default router
