import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ordersApi } from '@/api/orders'
import type { Order } from '@/types'
import { OrderStatus } from '@/types'

export const useOrdersStore = defineStore('orders', () => {
  // State
  const orders = ref<Order[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const sortedOrders = computed(() => {
    return [...orders.value].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  })

  const activeOrders = computed(() => {
    return sortedOrders.value.filter((order) => order.status !== OrderStatus.CANCELLED)
  })

  const cancelledOrders = computed(() => {
    return sortedOrders.value.filter((order) => order.status === OrderStatus.CANCELLED)
  })

  const orderCount = computed(() => orders.value.length)

  // Actions
  const fetchAllOrders = async (): Promise<Order[]> => {
    isLoading.value = true
    error.value = null

    try {
      orders.value = await ordersApi.getAllOrders()
      return orders.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load orders'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getOrderById = async (id: number): Promise<Order> => {
    isLoading.value = true
    error.value = null

    try {
      return await ordersApi.getOrderById(id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load order'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const cancelOrder = async (id: number): Promise<Order> => {
    isLoading.value = true
    error.value = null

    try {
      const cancelledOrder = await ordersApi.cancelOrder(id)

      // Update order in state
      const index = orders.value.findIndex((o) => o.id === id)
      if (index !== -1) {
        orders.value[index] = cancelledOrder
      }

      return cancelledOrder
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to cancel order'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const addOrder = (order: Order) => {
    orders.value.unshift(order)
  }

  const canCancelOrder = (order: Order): boolean => {
    const createdDate = new Date(order.createdAt)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    return createdDate > sevenDaysAgo
  }

  const getCancellableOrders = (): Order[] => {
    return orders.value.filter((order) => canCancelOrder(order))
  }

  return {
    // State
    orders,
    isLoading,
    error,

    // Computed
    activeOrders,
    cancelledOrders,
    orderCount,

    // Actions
    fetchAllOrders,
    getOrderById,
    cancelOrder,
    addOrder,
    canCancelOrder,
    getCancellableOrders,
  }
})
