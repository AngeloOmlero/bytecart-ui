<template>
  <div class="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">ByteCart</h1>
        <p class="mt-2 text-gray-600">Create your account</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-900 mb-2">Username</label>
          <Input
            v-model="form.username"
            placeholder="Choose a username"
            :error="errors.username"
            @update:modelValue="() => (errors.username = '')"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-900 mb-2">Password</label>
          <Input
            v-model="form.password"
            type="password"
            placeholder="Create a password"
            :error="errors.password"
            @update:modelValue="() => (errors.password = '')"
          />
          <p class="mt-1 text-xs text-gray-500">At least 8 characters recommended</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-900 mb-2">Confirm Password</label>
          <Input
            v-model="form.confirmPassword"
            type="password"
            placeholder="Confirm your password"
            :error="errors.confirmPassword"
            @update:modelValue="() => (errors.confirmPassword = '')"
          />
        </div>

        <div v-if="authStore.error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-800">{{ authStore.error }}</p>
        </div>

        <Button
          type="submit"
          variant="primary"
          :isLoading="authStore.isLoading"
          loadingText="Creating account..."
          class="w-full"
        >
          Sign Up
        </Button>

        <p class="text-center text-sm text-gray-600">
          Already have an account?
          <RouterLink to="/login" class="font-medium text-gray-900 hover:underline"
            >Log in</RouterLink
          >
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'

const router = useRouter()
const authStore = useAuthStore()

interface Form {
  username: string
  password: string
  confirmPassword: string
}

interface Errors {
  username: string
  password: string
  confirmPassword: string
}

const form = reactive<Form>({
  username: '',
  password: '',
  confirmPassword: '',
})

const errors = reactive<Errors>({
  username: '',
  password: '',
  confirmPassword: '',
})

const validateForm = (): boolean => {
  let isValid = true

  if (!form.username.trim()) {
    errors.username = 'Username is required'
    isValid = false
  } else if (form.username.length < 3) {
    errors.username = 'Username must be at least 3 characters'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    isValid = false
  }

  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) return

  try {
    await authStore.register({
      username: form.username,
      password: form.password,
    })

    router.push('/login')
  } catch (error) {
    // Error is handled by the store
  }
}
</script>
