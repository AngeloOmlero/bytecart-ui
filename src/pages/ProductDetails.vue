<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Back Button -->
      <button
        @click="goBack"
        class="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Products
      </button>

      <template v-if="!isLoading">
        <div v-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <!-- Product Image -->
          <div class="rounded-lg overflow-hidden h-96 bg-white">
            <img
              v-if="product.imageUrl"
              :src="getImageUrl(product.imageUrl)"
              :alt="product.name"
              class="w-full h-full object-contain object-center"
            />
            <div v-else class="flex items-center justify-center h-full text-gray-400">
              No image available
            </div>
          </div>

          <!-- Product Details -->
          <div class="flex flex-col justify-center">
            <h1 class="text-4xl font-bold text-gray-900">{{ product.name }}</h1>

            <p class="mt-6 text-lg text-gray-600">{{ product.description }}</p>

            <div class="mt-8">
              <p class="text-sm text-gray-600">Price</p>
              <p class="text-4xl font-bold text-gray-900">{{ formatPrice(product.price) }}</p>
            </div>

            <div class="mt-6">
              <p class="text-sm text-gray-600">Availability</p>
              <p v-if="product.stock > 0" class="text-lg font-semibold text-gray-900">
                {{ product.stock }} in stock
              </p>
              <p v-else class="text-lg font-semibold text-red-600">Out of stock</p>
            </div>

            <!-- Add to Cart Form -->
            <div v-if="product.stock > 0" class="mt-8">
              <!-- Login reminder for unauthenticated users -->
              <div
                v-if="!authStore.isAuthenticated"
                class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <p class="text-sm text-blue-800">
                  <span class="font-semibold">Log in to add items to cart</span> or create an
                  account to start shopping
                </p>
              </div>

              <div class="flex gap-4">
                <div class="flex items-center border-2 border-gray-200 rounded-lg">
                  <button
                    @click="decreaseQuantity"
                    class="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    −
                  </button>
                  <span class="px-6 py-2 font-semibold text-gray-900">{{ quantity }}</span>
                  <button
                    @click="increaseQuantity"
                    class="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    +
                  </button>
                </div>

                <Button
                  variant="primary"
                  :isLoading="cartStore.isLoading"
                  loadingText="Adding..."
                  @click="handleAddToCart"
                  class="flex-1"
                >
                  {{ authStore.isAuthenticated ? 'Add to Cart' : 'Log In to Add' }}
                </Button>
              </div>
            </div>

            <div v-if="addedToCart" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p class="text-sm text-green-800">✓ Added to cart successfully!</p>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <p class="text-lg text-gray-600">Product not found</p>
          <Button variant="outline" @click="goBack" class="mt-4"> Go Back </Button>
        </div>
      </template>

      <Loader v-else message="Loading product..." />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { getImageUrl } from '@/config/api'
import Button from '@/components/ui/Button.vue'
import Loader from '@/components/ui/Loader.vue'
import type { Product } from '@/types'

const router = useRouter()
const route = useRoute()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const authStore = useAuthStore()

const product = ref<Product | null>(null)
const isLoading = ref(false)
const quantity = ref(1)
const addedToCart = ref(false)

onMounted(async () => {
  const productId = parseInt(route.params.id as string)

  try {
    isLoading.value = true
    product.value = await productsStore.getProductById(productId)
  } catch (error) {
    console.error('Failed to load product:', error)
  } finally {
    isLoading.value = false
  }
})

const increaseQuantity = () => {
  if (product.value && quantity.value < product.value.stock) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const handleAddToCart = async () => {
  if (!authStore.isAuthenticated) {
    // Redirect to login with return URL
    router.push({
      name: 'Login',
      query: { redirect: route.fullPath },
    })
    return
  }

  try {
    addedToCart.value = false
    await cartStore.addToCart(product.value!.id, quantity.value)
    addedToCart.value = true

    setTimeout(() => {
      addedToCart.value = false
    }, 3000)
  } catch (error) {
    console.error('Failed to add to cart:', error)
  }
}

const goBack = () => {
  router.back()
}

const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`
}
</script>
