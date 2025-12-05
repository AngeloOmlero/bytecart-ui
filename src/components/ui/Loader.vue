<template>
  <div class="flex items-center justify-center p-4">
    <div class="text-center">
      <div class="inline-flex">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
      <p v-if="message" class="mt-4 text-gray-600">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string
}

defineProps<Props>()
</script>
