import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import type { RouteLocationNormalized, NavigationGuardNext, RouteRecordRaw } from 'vue-router'

// Define routes
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    meta: { title: 'Home', requiresAuth: false },
    redirect: { name: 'login' }, // TODO: change to home
  },
  // Auth
  {
    path: '/auth',
    name: 'auth',
    meta: { title: 'Authentication', requiresAuth: false },
    component: () => import('../layouts/AuthLayout.vue'),
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
  async (
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) => {
    const authStore = useUserStore()

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
    When the token is valid and user is trying to access auth pages,
    redirect them away from auth pages (for now, redirect to home which goes to login)
    TODO: Create a proper dashboard/home page for authenticated users
    */
    if (tokenIsValid && isAuthRoute) {
      // For now, allow access to auth pages even with valid token
      // Later, you should redirect to a proper dashboard
      return next()
    }

    if (!authStore.isAuthenticated) {
      try {
        // await authStore.setAuth()
      } catch {
        authStore.clearAuth()
        return next({ name: 'login' })
      }
    }

    next()
  },
)

export default router
