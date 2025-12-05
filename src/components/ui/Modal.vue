<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      @click="closeIfClickOutside"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all"
        @click.stop
      >
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-900">{{ title }}</h2>
          <button
            @click="$emit('close')"
            class="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="p-6">
          <slot />
        </div>
        <div v-if="$slots.footer" class="flex gap-3 p-6 border-t border-gray-200">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
  title: string
  closeOnClickOutside?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  closeOnClickOutside: true,
})

const emit = defineEmits<{
  close: []
}>()

const closeIfClickOutside = () => {
  if (props.closeOnClickOutside) {
    emit('close')
  }
}
</script>
