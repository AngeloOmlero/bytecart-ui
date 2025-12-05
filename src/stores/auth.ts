import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import type { User, AuthRequest, CreateUserRequest } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Initialize from localStorage
  const initializeAuth = () => {
    try {
      const storedToken = localStorage.getItem('authToken')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
      }
    } catch (err) {
      // Clear corrupted auth data
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      token.value = null
      user.value = null
    }
  }

  // Computed
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const currentUser = computed(() => user.value)

  // Actions
  const register = async (data: CreateUserRequest) => {
    isLoading.value = true
    error.value = null

    try {
      const newUser = await authApi.register(data)
      user.value = newUser

      // Auto-login after registration
      const loginData: AuthRequest = {
        username: data.username,
        password: data.password,
      }
      await login(loginData)

      return newUser
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const login = async (data: AuthRequest) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await authApi.login(data)
      token.value = response.token

      // Store in localStorage
      localStorage.setItem('authToken', response.token)

      // Fetch user details
      const currentUser = await authApi.getCurrentUser()
      user.value = currentUser
      localStorage.setItem('user', JSON.stringify(currentUser))

      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    authApi.logout()
    user.value = null
    token.value = null
    error.value = null
  }

  const fetchCurrentUser = async () => {
    if (!isAuthenticated.value) return

    try {
      const fetchedUser = await authApi.getCurrentUser()
      user.value = fetchedUser
      localStorage.setItem('user', JSON.stringify(fetchedUser))
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch user'
      logout()
      throw err
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,

    // Computed
    isAuthenticated,
    currentUser,

    // Actions
    initializeAuth,
    register,
    login,
    logout,
    fetchCurrentUser,
  }
})
