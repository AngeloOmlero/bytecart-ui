<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <template v-if="!cartStore.isEmpty">
        <!-- Cart Items -->
        <div class="space-y-4">
          <template v-if="!cartStore.isLoading">
            <div
              v-for="item in cartStore.cartItems"
              :key="item.id"
              class="flex gap-6 p-6 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
            >
              <!-- Product Image -->
              <div class="flex-shrink-0 w-24 h-24 bg-white rounded-lg overflow-hidden">
                <img
                  v-if="item.product.imageUrl"
                  :src="getImageUrl(item.product.imageUrl)"
                  :alt="item.product.name"
                  class="w-full h-full object-contain object-center"
                />
              </div>

              <!-- Product Details -->
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900">{{ item.product.name }}</h3>
                <p class="text-gray-600 text-sm mt-1">{{ item.product.description }}</p>

                <div class="mt-4 flex items-center justify-between">
                  <div class="flex items-center border-2 border-gray-200 rounded-lg">
                    <button
                      @click="decreaseQuantity(item.id)"
                      class="px-3 py-1 text-gray-600 hover:text-gray-900"
                    >
                      −
                    </button>
                    <span class="px-4 py-1 font-semibold text-gray-900">{{ item.quantity }}</span>
                    <button
                      @click="increaseQuantity(item.id, item.product.stock)"
                      class="px-3 py-1 text-gray-600 hover:text-gray-900"
                    >
                      +
                    </button>
                  </div>

                  <div class="text-right">
                    <p class="text-sm text-gray-600">
                      Price: {{ formatPrice(item.product.price) }}
                    </p>
                    <p class="text-xl font-bold text-gray-900">
                      {{ formatPrice(item.product.price * item.quantity) }}
                    </p>
                    <Button
                      v-if="selectedItemId !== item.id"
                      variant="primary"
                      @click="handleBuyNow(item.id)"
                      class="mt-3 w-full"
                    >
                      Buy Now
                    </Button>
                    <Button
                      v-else
                      variant="primary"
                      :isLoading="isCheckingOut"
                      loadingText="Processing..."
                      @click="proceedToCheckout"
                      class="mt-3 w-full"
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </div>
              </div>

              <!-- Remove Button -->
              <button
                @click="handleRemoveItem(item.id)"
                class="text-gray-400 hover:text-red-600 transition-colors"
                title="Remove item"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </template>

          <Loader v-else message="Updating cart..." />
        </div>
      </template>

      <!-- Empty Cart -->
      <div v-else class="text-center py-12">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h2 class="mt-4 text-xl font-semibold text-gray-900">Your cart is empty</h2>
        <p class="mt-2 text-gray-600">Start shopping to add items to your cart</p>
        <RouterLink to="/products">
          <Button variant="primary" class="mt-6"> Browse Products </Button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { getImageUrl } from '@/config/api'
import Button from '@/components/ui/Button.vue'
import Loader from '@/components/ui/Loader.vue'

const router = useRouter()
const cartStore = useCartStore()
const selectedItemId = ref<number | null>(null)
const isCheckingOut = ref(false)

onMounted(async () => {
  try {
    await cartStore.fetchCart()
  } catch (error) {
    console.error('Failed to load cart:', error)
  }
})

const increaseQuantity = async (itemId: number, maxStock: number) => {
  const item = cartStore.cartItems.find((i) => i.id === itemId)
  if (item && item.quantity < maxStock) {
    try {
      await cartStore.updateCartItemQuantity(itemId, item.quantity + 1)
    } catch (error) {
      console.error('Failed to update quantity:', error)
    }
  }
}

const decreaseQuantity = async (itemId: number) => {
  const item = cartStore.cartItems.find((i) => i.id === itemId)
  if (item && item.quantity > 1) {
    try {
      await cartStore.updateCartItemQuantity(itemId, item.quantity - 1)
    } catch (error) {
      console.error('Failed to update quantity:', error)
    }
  }
}

const handleRemoveItem = async (itemId: number) => {
  try {
    await cartStore.removeFromCart(itemId)
  } catch (error) {
    console.error('Failed to remove item:', error)
  }
}

const handleBuyNow = (itemId: number) => {
  // Just mark this item as selected to show "Proceed to Checkout" button
  selectedItemId.value = itemId
}

const proceedToCheckout = () => {
  if (selectedItemId.value) {
    // Navigate to checkout page with selected item
    router.push({ name: 'Checkout', query: { itemId: selectedItemId.value } })
  }
}

const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`
}
</script>
