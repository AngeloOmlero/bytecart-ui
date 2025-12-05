import { apiClient } from './client'
import type { User, AuthRequest, AuthResponse, CreateUserRequest } from '@/types'

export const authApi = {
  /**
   * Register a new user
   */
  async register(data: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<User>('/auth/register', data)
    return response.data
  },

  /**
   * Login with username and password
   */
  async login(data: AuthRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data)
    return response.data
  },

  /**
   * Get current user details
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me')
    return response.data
  },

  /**
   * Logout (clear token from storage)
   */
  logout(): void {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  },
}
