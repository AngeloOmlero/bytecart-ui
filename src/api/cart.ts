import { apiClient } from './client'
import type { Cart, AddToCartRequest, UpdateCartItemRequest } from '@/types'

export const cartApi = {
  /**
   * Get cart for current user
   */
  async getCart(): Promise<Cart> {
    const response = await apiClient.get<Cart>('/cart')
    return response.data
  },

  /**
   * Add product to cart
   */
  async addProductToCart(data: AddToCartRequest): Promise<Cart> {
    const response = await apiClient.post<Cart>('/cart/add', data)
    return response.data
  },

  /**
   * Update cart item quantity
   */
  async updateCartItemQuantity(itemId: number, data: UpdateCartItemRequest): Promise<Cart> {
    const response = await apiClient.put<Cart>(`/cart/update/${itemId}`, data)
    return response.data
  },

  /**
   * Remove item from cart
   */
  async removeCartItem(itemId: number): Promise<void> {
    await apiClient.delete(`/cart/remove/${itemId}`)
  },

  /**
   * Checkout cart with a specific item (based on backend implementation)
   */
  async checkoutCart(cartItemId: number) {
    const response = await apiClient.post(`/cart/checkout/${cartItemId}`)
    return response.data
  },
}
