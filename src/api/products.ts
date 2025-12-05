import { apiClient } from './client'
import type { Product } from '@/types'

export const productsApi = {
  /**
   * Get all products
   */
  async getAllProducts(): Promise<Product[]> {
    const response = await apiClient.get<Product[]>('/products')
    return response.data
  },

  /**
   * Get product by ID
   */
  async getProductById(id: number): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`)
    return response.data
  },
}
