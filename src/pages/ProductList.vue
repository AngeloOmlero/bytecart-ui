<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Products</h1>
        <p class="mt-2 text-gray-600">Browse our collection of digital products</p>
      </div>

      <!-- Search and Filter -->
      <div class="mb-8 flex gap-4">
        <Input v-model="searchQuery" placeholder="Search products..." class="flex-1" />
      </div>

      <!-- Products Grid -->
      <template v-if="!productsStore.isLoading">
        <div
          v-if="displayedProducts.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div v-for="product in displayedProducts" :key="product.id" class="flex flex-col">
            <Card
              :title="product.name"
              :description="product.description"
              :price="product.price"
              :stock="product.stock"
              :imageUrl="getImageUrl(product.imageUrl)"
            >
              <div class="mt-4 flex gap-2">
                <Button
                  variant="primary"
                  :disabled="product.stock === 0"
                  @click="goToProductDetails(product.id)"
                  class="flex-1"
                >
                  View Details
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <p class="text-lg text-gray-600">No products found</p>
        </div>
      </template>

      <!-- Loading State -->
      <Loader v-else message="Loading products..." />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { getImageUrl } from '@/config/api'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Loader from '@/components/ui/Loader.vue'

const router = useRouter()
const productsStore = useProductsStore()
const searchQuery = ref('')

onMounted(async () => {
  try {
    await productsStore.fetchAllProducts()
    // Log image URLs for debugging
    productsStore.products.forEach((product) => {
      const imageUrl = getImageUrl(product.imageUrl)
    })
  } catch (error) {
    console.error('Failed to load products:', error)
  }
})

const displayedProducts = computed(() => {
  if (!searchQuery.value) {
    return productsStore.productList
  }

  return productsStore.searchProducts(searchQuery.value)
})

const goToProductDetails = (productId: number) => {
  router.push({ name: 'ProductDetails', params: { id: productId } })
}
</script>
