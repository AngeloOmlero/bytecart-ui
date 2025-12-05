import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartApi } from '@/api/cart'
import type { Cart, CartItem, AddToCartRequest } from '@/types'

export const useCartStore = defineStore('cart', () => {
  // State
  const cart = ref<Cart | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const cartItems = computed(() => cart.value?.items || [])
  const itemCount = computed(() => cartItems.value.length)
  const cartTotal = computed(() => {
    // Use API total if available, otherwise calculate from items
    if (cart.value?.total !== undefined && cart.value.total > 0) {
      return cart.value.total
    }
    // Calculate total from items
    return cartItems.value.reduce((sum, item) => {
      return sum + item.product.price * item.quantity
    }, 0)
  })
  const isEmpty = computed(() => itemCount.value === 0)

  // Actions
  const fetchCart = async (): Promise<Cart> => {
    isLoading.value = true
    error.value = null

    try {
      cart.value = await cartApi.getCart()
      return cart.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load cart'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const addToCart = async (productId: number, quantity: number): Promise<Cart> => {
    isLoading.value = true
    error.value = null

    try {
      const request: AddToCartRequest = { productId, quantity }
      cart.value = await cartApi.addProductToCart(request)
      return cart.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to add product to cart'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateCartItemQuantity = async (itemId: number, quantity: number): Promise<Cart> => {
    isLoading.value = true
    error.value = null

    try {
      cart.value = await cartApi.updateCartItemQuantity(itemId, { quantity })
      return cart.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update cart item'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const removeFromCart = async (itemId: number): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      await cartApi.removeCartItem(itemId)
      // Refresh cart to get updated state
      await fetchCart()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to remove item from cart'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const checkout = async (cartItemId: number): Promise<any> => {
    isLoading.value = true
    error.value = null

    try {
      const order = await cartApi.checkoutCart(cartItemId)
      return order
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to checkout'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const clearCart = () => {
    cart.value = null
    error.value = null
  }

  const getItemSubtotal = (item: CartItem): number => {
    return item.product.price * item.quantity
  }

  const recalculateTotal = (): number => {
    if (!cart.value) return 0
    return cart.value.items.reduce((sum, item) => sum + getItemSubtotal(item), 0)
  }

  return {
    // State
    cart,
    isLoading,
    error,

    // Computed
    cartItems,
    itemCount,
    cartTotal,
    isEmpty,

    // Actions
    fetchCart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    checkout,
    clearCart,
    getItemSubtotal,
    recalculateTotal,
  }
})
