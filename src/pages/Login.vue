<template>
  <div class="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">ByteCart</h1>
        <p class="mt-2 text-gray-600">Welcome back</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-900 mb-2">Username</label>
          <Input
            v-model="form.username"
            placeholder="Enter your username"
            :error="errors.username"
            @update:modelValue="() => (errors.username = '')"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-900 mb-2">Password</label>
          <Input
            v-model="form.password"
            type="password"
            placeholder="Enter your password"
            :error="errors.password"
            @update:modelValue="() => (errors.password = '')"
          />
        </div>

        <div v-if="authStore.error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-800">{{ authStore.error }}</p>
        </div>

        <Button
          type="submit"
          variant="primary"
          :isLoading="authStore.isLoading"
          loadingText="Logging in..."
          class="w-full"
        >
          Login
        </Button>

        <p class="text-center text-sm text-gray-600">
          Don't have an account?
          <RouterLink to="/register" class="font-medium text-gray-900 hover:underline"
            >Sign up</RouterLink
          >
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

interface Form {
  username: string
  password: string
}

interface Errors {
  username: string
  password: string
}

const form = reactive<Form>({
  username: '',
  password: '',
})

const errors = reactive<Errors>({
  username: '',
  password: '',
})

const validateForm = (): boolean => {
  let isValid = true

  if (!form.username.trim()) {
    errors.username = 'Username is required'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return

  try {
    await authStore.login(form)

    const redirect = route.query.redirect as string
    router.push(redirect || '/products')
  } catch (error) {
    // Error is handled by the store
  }
}
</script>
