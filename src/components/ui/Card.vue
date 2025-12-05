<template>
  <div
    class="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
  >
    <div class="overflow-hidden rounded-t-lg h-48 bg-white flex items-center justify-center">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="title"
        class="w-full h-full object-contain object-center"
        @error="onImageError"
      />
      <img
        v-else-if="showPlaceholder"
        :src="placeholderImage"
        :alt="title"
        class="w-full h-full object-contain object-center"
      />
      <div v-else class="text-center text-gray-400 text-sm">
        <svg class="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        No image
      </div>
    </div>
    <div class="p-5">
      <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">{{ title }}</h3>
      <p class="mt-2 text-sm text-gray-600 line-clamp-2">{{ description }}</p>
      <div class="mt-4 flex items-center justify-between">
        <span class="text-2xl font-bold text-gray-900">${{ price.toFixed(2) }}</span>
        <span v-if="stock > 0" class="text-xs text-gray-600">{{ stock }} in stock</span>
        <span v-else class="text-xs text-red-600 font-medium">Out of stock</span>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PLACEHOLDER_IMAGE } from '@/config/api'

interface Props {
  title: string
  description: string
  price: number
  stock: number
  imageUrl?: string
}

defineProps<Props>()

const showPlaceholder = ref(false)
const placeholderImage = PLACEHOLDER_IMAGE

const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  console.error(`Failed to load image: ${img.src}`)
  // Show placeholder image instead
  showPlaceholder.value = true
  img.style.display = 'none'
}
</script>
