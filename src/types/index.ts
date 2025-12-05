/**
 * Authentication Types
 */
export interface User {
  id: number
  username: string
}

export interface AuthRequest {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
}

export interface CreateUserRequest {
  username: string
  password: string
}

/**
 * Product Types
 */
export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  imageUrl?: string
}

export interface ProductsResponse {
  products: Product[]
}

/**
 * Cart Types
 */
export interface CartItem {
  id: number
  productId: number
  quantity: number
  product: Product
  subtotal: number
}

export interface Cart {
  id: number
  userId: number
  items: CartItem[]
  total: number
}

export interface AddToCartRequest {
  productId: number
  quantity: number
}

export interface UpdateCartItemRequest {
  quantity: number
}

/**
 * Order Types
 */
export interface Order {
  id: number
  user: {
    id: number
    username: string
  }
  orderItems: OrderItem[]
  totalAmount: number
  status: OrderStatus
  createdAt: string
}

export interface OrderItem {
  id: number
  productName: string
  price: number
  quantity: number
  subtotal: number
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

/**
 * API Error Response
 */
export interface ApiError {
  status: number
  message: string
  details?: Record<string, unknown>
}

/**
 * Pagination
 */
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

/**
 * Generic API Response
 */
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  meta?: PaginationMeta
}
