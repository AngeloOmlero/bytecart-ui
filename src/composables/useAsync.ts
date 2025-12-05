/**
 * Composable for async operations with loading and error states
 */
import { ref } from 'vue'

export const useAsync = () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const execute = async <T>(asyncFn: () => Promise<T>): Promise<T | null> => {
    isLoading.value = true
    error.value = null

    try {
      const result = await asyncFn()
      return result
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'An error occurred'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    isLoading,
    error,
    execute,
    clearError,
  }
}
