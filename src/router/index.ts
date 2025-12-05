import { createRouter, createWebHistory } from 'vue-router'
import type {
  Router,
  RouteRecordRaw,
  NavigationGuardNext,
  RouteLocationNormalized,
} from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Lazy load pages for better performance
const Login = () => import('../pages/Login.vue')
const Register = () => import('../pages/Register.vue')
const ProductList = () => import('../pages/ProductList.vue')
const ProductDetails = () => import('../pages/ProductDetails.vue')
const Cart = () => import('../pages/Cart.vue')
const Checkout = () => import('../pages/Checkout.vue')
const Orders = () => import('../pages/Orders.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/products',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true },
  },
  {
    path: '/products',
    name: 'ProductList',
    component: ProductList,
  },
  {
    path: '/products/:id',
    name: 'ProductDetails',
    component: ProductDetails,
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: { requiresAuth: true },
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout,
    meta: { requiresAuth: true },
  },
  {
    path: '/orders',
    name: 'Orders',
    component: Orders,
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/products',
  },
]

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

/**
 * Navigation guard for route protection
 */
router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authStore = useAuthStore()

    // Initialize auth from localStorage
    if (!authStore.currentUser) {
      authStore.initializeAuth()
    }

    const isAuthenticated = authStore.isAuthenticated
    const requiresAuth = to.meta.requiresAuth as boolean
    const requiresGuest = to.meta.requiresGuest as boolean

    // Protect routes that require authentication
    if (requiresAuth && !isAuthenticated) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }

    // Redirect authenticated users away from auth pages
    if (requiresGuest && isAuthenticated) {
      next({ name: 'ProductList' })
      return
    }

    next()
  },
)

export default router
