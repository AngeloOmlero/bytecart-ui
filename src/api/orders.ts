import { apiClient } from './client'
import type { Order } from '@/types'

export const ordersApi = {
  /**
   * Get all orders for current user
   */
  async getAllOrders(): Promise<Order[]> {
    const response = await apiClient.get<Order[]>('/orders')
    return response.data
  },

  /**
   * Get order by ID
   */
  async getOrderById(id: number): Promise<Order> {
    const response = await apiClient.get<Order>(`/orders/${id}`)
    return response.data
  },

  /**
   * Cancel an order
   */
  async cancelOrder(id: number): Promise<Order> {
    const response = await apiClient.put<Order>(`/orders/${id}/cancel`)
    return response.data
  },
}
