<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      <template v-if="!ordersStore.isLoading">
        <!-- Active Orders -->
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Active Orders</h2>
        <div v-if="ordersStore.activeOrders.length > 0" class="space-y-6">
          <div
            v-for="order in ordersStore.activeOrders"
            :key="order.id"
            class="p-6 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
          >
            <!-- Order Header -->
            <div
              class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b border-gray-200"
            >
              <div>
                <p class="text-sm text-gray-600">Order #{{ order.id }}</p>
                <p class="text-lg font-semibold text-gray-900">{{ formatDate(order.createdAt) }}</p>
              </div>
              <div class="mt-4 md:mt-0 text-right">
                <p class="text-sm text-gray-600">Status</p>
                <p :class="['text-lg font-semibold', getStatusColor(order.status)]">
                  {{ formatStatus(order.status) }}
                </p>
              </div>
            </div>

            <!-- Order Items -->
            <div class="mb-6 space-y-3">
              <div
                v-for="item in order.orderItems"
                :key="item.id"
                class="flex justify-between text-gray-600"
              >
                <span>{{ item.productName }} x {{ item.quantity }}</span>
                <span>{{ formatPrice(item.subtotal) }}</span>
              </div>
            </div>

            <!-- Order Total and Actions -->
            <div
              class="flex flex-col md:flex-row md:items-center md:justify-between pt-4 border-t border-gray-200"
            >
              <div>
                <p class="text-sm text-gray-600">Total</p>
                <p class="text-2xl font-bold text-gray-900">{{ formatPrice(order.totalAmount) }}</p>
              </div>

              <div class="mt-4 md:mt-0 flex gap-3">
                <Button variant="outline" @click="openDetailsModal(order)"> View Details </Button>

                <template v-if="canCancel(order)">
                  <Button variant="danger" @click="promptCancelOrder(order.id)">
                    Cancel Order
                  </Button>
                </template>
                <template v-else-if="order.status !== OrderStatus.CANCELLED">
                  <p class="text-sm text-gray-600 flex items-center">
                    Cannot cancel orders older than 7 days or after shipping
                  </p>
                </template>
              </div>
            </div>
          </div>
        </div>
        <!-- Empty State for Active Orders -->
        <div v-else class="text-center py-12 border border-dashed rounded-lg">
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h2 class="mt-4 text-xl font-semibold text-gray-900">No active orders</h2>
          <p class="mt-2 text-gray-600">Start shopping to create your first order</p>
          <RouterLink to="/products">
            <Button variant="primary" class="mt-6"> Start Shopping </Button>
          </RouterLink>
        </div>

        <!-- Cancelled Orders -->
        <div v-if="ordersStore.cancelledOrders.length > 0" class="mt-12">
          <h2 class="text-2xl font-semibold text-gray-800 mb-6">Cancelled Orders</h2>
          <div class="space-y-6">
            <div
              v-for="order in ordersStore.cancelledOrders"
              :key="order.id"
              class="p-6 border border-gray-200 rounded-lg bg-gray-50"
            >
              <!-- Order Header -->
              <div
                class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b border-gray-200"
              >
                <div>
                  <p class="text-sm text-gray-600">Order #{{ order.id }}</p>
                  <p class="text-lg font-semibold text-gray-900">
                    {{ formatDate(order.createdAt) }}
                  </p>
                </div>
                <div class="mt-4 md:mt-0 text-right">
                  <p class="text-sm text-gray-600">Status</p>
                  <p :class="['text-lg font-semibold', getStatusColor(order.status)]">
                    {{ formatStatus(order.status) }}
                  </p>
                </div>
              </div>

              <!-- Order Items -->
              <div class="mb-6 space-y-3">
                <div
                  v-for="item in order.orderItems"
                  :key="item.id"
                  class="flex justify-between text-gray-600"
                >
                  <span>{{ item.productName }} x {{ item.quantity }}</span>
                  <span>{{ formatPrice(item.subtotal) }}</span>
                </div>
              </div>

              <!-- Order Total -->
              <div class="pt-4 border-t border-gray-200 flex justify-between items-center">
                <div>
                  <p class="text-sm text-gray-600">Total</p>
                  <p class="text-2xl font-bold text-gray-900">
                    {{ formatPrice(order.totalAmount) }}
                  </p>
                </div>
                <Button variant="outline" @click="openDetailsModal(order)"> View Details </Button>
              </div>
            </div>
          </div>
        </div>
      </template>

      <Loader v-else message="Loading orders..." />

      <!-- Order Details Modal -->
      <Modal :is-open="isDetailsModalOpen" title="Order Details" @close="closeDetailsModal">
        <div v-if="selectedOrder" class="space-y-6">
          <!-- Modal Header -->
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm text-gray-600">Order #{{ selectedOrder.id }}</p>
              <p class="text-lg font-semibold text-gray-900">
                {{ formatDate(selectedOrder.createdAt) }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600">Status</p>
              <p :class="['text-lg font-semibold', getStatusColor(selectedOrder.status)]">
                {{ formatStatus(selectedOrder.status) }}
              </p>
            </div>
          </div>

          <!-- Modal Items -->
          <div class="border-t border-b border-gray-200 py-4">
            <h3 class="text-md font-semibold text-gray-900 mb-4">Items</h3>
            <div class="space-y-3">
              <div
                v-for="item in selectedOrder.orderItems"
                :key="item.id"
                class="flex justify-between text-gray-600"
              >
                <div>
                  <p class="font-medium text-gray-800">{{ item.productName }}</p>
                  <p class="text-sm">Qty: {{ item.quantity }}</p>
                </div>
                <span class="font-medium text-gray-800">{{ formatPrice(item.subtotal) }}</span>
              </div>
            </div>
          </div>

          <!-- Modal Total -->
          <div class="flex justify-between items-center">
            <span class="font-semibold text-gray-900">Total</span>
            <span class="text-2xl font-bold text-gray-900">{{
              formatPrice(selectedOrder.totalAmount)
            }}</span>
          </div>
        </div>

        <template #footer>
          <Button variant="outline" @click="closeDetailsModal"> Close </Button>
        </template>
      </Modal>

      <!-- Cancel Order Modal -->
      <Modal :is-open="isCancelModalOpen" title="Cancel Order" @close="closeCancelModal">
        <p>Are you sure you want to cancel this order? This action cannot be undone.</p>
        <div class="mt-4 bg-red-50 p-3 rounded-md border border-red-100">
          <p class="text-sm text-red-700">
            This will permanently cancel the order.
          </p>
        </div>
        <template #footer>
          <Button variant="outline" @click="closeCancelModal"> Back </Button>
          <Button variant="danger" @click="confirmCancelOrder"> Confirm Cancellation </Button>
        </template>
      </Modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useOrdersStore } from '@/stores/orders'
import Button from '@/components/ui/Button.vue'
import Loader from '@/components/ui/Loader.vue'
import Modal from '@/components/ui/Modal.vue'
import { OrderStatus, type Order } from '@/types'

const ordersStore = useOrdersStore()

// Details Modal State
const isDetailsModalOpen = ref(false)
const selectedOrder = ref<Order | null>(null)

// Cancel Modal State
const isCancelModalOpen = ref(false)
const orderToCancelId = ref<number | null>(null)

onMounted(async () => {
  try {
    await ordersStore.fetchAllOrders()
  } catch (error) {
    console.error('Failed to load orders:', error)
  }
})

const canCancel = (order: Order): boolean => {
  if (order.status !== 'PENDING' && order.status !== 'CONFIRMED') {
    return false
  }
  return ordersStore.canCancelOrder(order)
}

const promptCancelOrder = (orderId: number) => {
  orderToCancelId.value = orderId
  isCancelModalOpen.value = true
}

const closeCancelModal = () => {
  isCancelModalOpen.value = false
  orderToCancelId.value = null
}

const confirmCancelOrder = async () => {
  if (orderToCancelId.value === null) return

  try {
    await ordersStore.cancelOrder(orderToCancelId.value)
  } catch (error) {
    console.error('Failed to cancel order:', error)
  } finally {
    closeCancelModal()
  }
}

const openDetailsModal = (order: Order) => {
  selectedOrder.value = order
  isDetailsModalOpen.value = true
}

const closeDetailsModal = () => {
  isDetailsModalOpen.value = false
  // Delay clearing to prevent flicker during closing animation
  setTimeout(() => {
    selectedOrder.value = null
  }, 300)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatPrice = (price: number | undefined): string => {
  if (price === undefined || price === null) {
    return '$0.00'
  }
  return `$${price.toFixed(2)}`
}

const formatStatus = (status: OrderStatus): string => {
  const s = String(status)
  return s.charAt(0) + s.slice(1).toLowerCase()
}

const getStatusColor = (status: OrderStatus): string => {
  const statusColors: Record<string, string> = {
    [OrderStatus.PENDING]: 'text-yellow-600',
    [OrderStatus.CONFIRMED]: 'text-blue-600',
    [OrderStatus.SHIPPED]: 'text-blue-600',
    [OrderStatus.DELIVERED]: 'text-green-600',
    [OrderStatus.CANCELLED]: 'text-red-600',
  }
  return statusColors[status] || 'text-gray-600'
}
</script>
