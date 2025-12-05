<template>
  <input
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    :class="[
      'w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg',
      'bg-white text-gray-900 placeholder-gray-500',
      'focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200',
      'transition-all duration-200',
      'disabled:bg-gray-100 disabled:cursor-not-allowed',
      { 'border-red-500 focus:ring-red-200': error },
    ]"
  />
  <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
</template>

<script setup lang="ts">
interface Props {
  type?: string
  modelValue: string
  placeholder?: string
  disabled?: boolean
  error?: string
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
  error: '',
})

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
