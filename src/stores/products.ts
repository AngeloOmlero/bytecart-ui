import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { productsApi } from '@/api/products'
import type { Product } from '@/types'

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref<Product[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const productList = computed(() => products.value)
  const productCount = computed(() => products.value.length)

  // Actions
  const fetchAllProducts = async () => {
    isLoading.value = true
    error.value = null

    try {
      products.value = await productsApi.getAllProducts()
      return products.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load products'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getProductById = async (id: number): Promise<Product> => {
    // First check if product is already in state
    const cachedProduct = products.value.find((p) => p.id === id)
    if (cachedProduct) {
      return cachedProduct
    }

    // Fetch from API if not cached
    try {
      const product = await productsApi.getProductById(id)
      // Add to state if not already there
      if (!products.value.find((p) => p.id === id)) {
        products.value.push(product)
      }
      return product
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load product'
      throw err
    }
  }

  const searchProducts = (query: string): Product[] => {
    return products.value.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()),
    )
  }

  return {
    // State
    products,
    isLoading,
    error,

    // Computed
    productList,
    productCount,

    // Actions
    fetchAllProducts,
    getProductById,
    searchProducts,
  }
})
