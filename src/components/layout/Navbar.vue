<template>
  <nav class="sticky top-0 z-40 bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->

        <RouterLink to="/" class="flex items-center gap-1">
          <img :src="logo" alt="ByteCart Logo" class="h-14 w-15" />
          <span class="text-2xl font-bold text-gray-900 hover:text-gray-700"> ByteCart </span>
        </RouterLink>

        <!-- Nav Links -->
        <div class="hidden md:flex items-center gap-8">
          <RouterLink
            to="/products"
            :class="[
              'text-sm font-medium transition-colors',
              isActive('ProductList') ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900',
            ]"
          >
            Products
          </RouterLink>
          <RouterLink
            v-if="isAuthenticated"
            to="/orders"
            :class="[
              'text-sm font-medium transition-colors',
              isActive('Orders') ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900',
            ]"
          >
            Orders
          </RouterLink>
        </div>

        <!-- Right Section -->
        <div class="flex items-center gap-4">
          <!-- Cart Icon -->
          <RouterLink
            to="/cart"
            class="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span
              v-if="cartItemCount > 0"
              class="absolute top-0 right-0 h-5 w-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center"
            >
              {{ cartItemCount }}
            </span>
          </RouterLink>

          <!-- Auth Links -->
          <div class="flex items-center gap-2">
            <template v-if="isAuthenticated">
              <span class="text-sm text-gray-600">{{ currentUser?.username }}</span>
              <button
                @click="handleLogout"
                class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Logout
              </button>
            </template>
            <template v-else>
              <RouterLink
                to="/login"
                class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Login
              </RouterLink>
              <RouterLink
                to="/register"
                class="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Sign Up
              </RouterLink>
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import logo from '@/asset/byte-cart-logo.png'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const currentUser = computed(() => authStore.currentUser)
const cartItemCount = computed(() => cartStore.itemCount)

const isActive = (routeName: string): boolean => {
  return router.currentRoute.value.name === routeName
}

const handleLogout = () => {
  authStore.logout()
  cartStore.clearCart()
  router.push('/login')
}
</script>
