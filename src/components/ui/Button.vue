<template>
  <button
    :type="type"
    :disabled="disabled || isLoading"
    :class="[
      'px-4 py-2.5 rounded-lg font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variantClasses,
    ]"
  >
    <span v-if="isLoading" class="flex items-center gap-2">
      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {{ loadingText }}
    </span>
    <span v-else>
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger'

interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: ButtonVariant
  disabled?: boolean
  isLoading?: boolean
  loadingText?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  disabled: false,
  isLoading: false,
  loadingText: 'Loading...',
})

const variantClasses = computed(() => {
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400',
    outline: 'border-2 border-gray-300 text-gray-900 hover:bg-gray-50 active:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  }
  return variants[props.variant]
})
</script>
