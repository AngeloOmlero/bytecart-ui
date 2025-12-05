<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <template v-if="checkoutItem">
        <!-- Order Summary -->
        <div class="max-w-md mx-auto p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 class="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

          <div class="space-y-3 mb-6 pb-6 border-b border-gray-200">
            <div class="flex justify-between text-gray-600">
              <div>
                <p class="font-medium text-gray-900">{{ checkoutItem.product.name }}</p>
                <p class="text-sm text-gray-500">Qty: {{ checkoutItem.quantity }}</p>
              </div>
              <span class="font-semibold text-gray-900">{{
                formatPrice(summary.subtotal)
              }}</span>
            </div>
          </div>

          <div class="space-y-3 mb-6 pb-6 border-b border-gray-200">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{{ formatPrice(summary.subtotal) }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{{ formatPrice(summary.shipping) }}</span>
            </div>
          </div>

          <div class="flex justify-between items-center mb-6">
            <span class="font-semibold text-gray-900">Total</span>
            <span class="text-3xl font-bold text-gray-900">{{
              formatPrice(summary.total)
            }}</span>
          </div>

          <!-- Error Message -->
          <div v-if="checkoutError" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-800">{{ checkoutError }}</p>
          </div>

          <!-- Success Message -->
          <div
            v-if="checkoutSuccess"
            class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <p class="text-sm text-green-800">
              ✓ Order placed successfully! Redirecting to orders...
            </p>
          </div>

          <!-- Buttons -->
          <div class="flex gap-4">
            <Button variant="outline" @click="goBack" class="flex-1"> Back to Cart </Button>
            <Button
              variant="primary"
              :isLoading="isLoading"
              loadingText="Placing..."
              @click="handleCheckout"
              class="flex-1"
            >
              Confirm Order
            </Button>
          </div>
        </div>
      </template>

      <!-- Empty Cart or Item Not Found -->
      <div v-else class="text-center py-12">
        <h2 class="text-xl font-semibold text-gray-900">
          {{ cartStore.isLoading ? 'Loading...' : 'Item not found or cart is empty' }}
        </h2>
        <RouterLink to="/cart">
          <Button variant="primary" class="mt-6"> Go to Cart </Button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import Button from '@/components/ui/Button.vue'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()

const isLoading = ref(false)
const checkoutError = ref('')
const checkoutSuccess = ref(false)

const checkoutItemId = computed(() => Number(route.query.itemId))

const checkoutItem = computed(() => {
  if (!checkoutItemId.value || !cartStore.cartItems) return null
  return cartStore.cartItems.find((item) => item.id === checkoutItemId.value)
})

const summary = computed(() => {
  if (!checkoutItem.value) {
    return {
      subtotal: 0,
      shipping: 0,
      total: 0,
    }
  }
  const subtotal = checkoutItem.value.product.price * checkoutItem.value.quantity
  const shipping = 0 // Assuming shipping is free
  const total = subtotal + shipping
  return { subtotal, shipping, total }
})

onMounted(() => {
  // Fetch cart if it's not already loaded
  if (cartStore.cart === null) {
    cartStore.fetchCart()
  }
})

const handleCheckout = async () => {
  if (!checkoutItemId.value) {
    checkoutError.value = 'No item selected for checkout.'
    return
  }

  isLoading.value = true
  checkoutError.value = ''
  checkoutSuccess.value = false

  try {
    // Call checkout API with the specific cart item
    await cartStore.checkout(checkoutItemId.value)

    // Mark checkout as successful
    checkoutSuccess.value = true

    // Redirect to orders page after 2 seconds
    setTimeout(() => {
      router.push('/orders')
    }, 2000)
  } catch (error: any) {
    checkoutError.value = error.response?.data?.message || 'Failed to place order'
    console.error('Checkout failed:', error)
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.back()
}

const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`
}
</script>
