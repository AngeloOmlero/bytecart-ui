# ByteCart - Minimalist E-commerce Frontend

A modern, production-ready e-commerce frontend built with Vue 3, TypeScript, Pinia, and Tailwind CSS. ByteCart provides a clean, minimalist user experience with extensive features for browsing products, managing carts, and tracking orders.

## 🎨 Design Principles

- **Minimalist UI**: Clean design with plenty of white space
- **Soft Shadows**: Subtle depth and elevation
- **Neutral Palette**: Gray-based color scheme for timeless appeal
- **Responsive**: Mobile-first, works on all devices
- **Smooth Transitions**: Polished animations and interactions
- **Accessible**: WCAG compliant with proper focus management

## 🏗️ Architecture

```
src/
├── api/                    # Typed API modules
│   ├── auth.ts            # Authentication endpoints
│   ├── cart.ts            # Cart management endpoints
│   ├── client.ts          # Axios client with JWT interceptor
│   ├── orders.ts          # Orders endpoints
│   └── products.ts        # Products endpoints
├── components/
│   ├── layout/
│   │   ├── Footer.vue     # App footer
│   │   └── Navbar.vue     # Navigation bar
│   └── ui/
│       ├── Button.vue     # Reusable button component
│       ├── Card.vue       # Product card component
│       ├── Input.vue      # Form input component
│       ├── Loader.vue     # Loading indicator
│       └── Modal.vue      # Modal dialog component
├── composables/           # Reusable Vue 3 Composition API logic
├── pages/
│   ├── Cart.vue           # Shopping cart page
│   ├── Checkout.vue       # Checkout form
│   ├── Login.vue          # Login page
│   ├── Orders.vue         # Orders history page
│   ├── ProductDetails.vue # Product detail view
│   ├── ProductList.vue    # Products listing
│   └── Register.vue       # Registration page
├── router/
│   └── index.ts           # Vue Router configuration with guards
├── stores/
│   ├── auth.ts            # Authentication state management
│   ├── cart.ts            # Cart state management
│   ├── orders.ts          # Orders state management
│   └── products.ts        # Products state management
├── styles/
│   └── main.css           # Global styles with Tailwind
├── types/
│   └── index.ts           # TypeScript interfaces & types
├── utils/
│   └── helpers.ts         # Utility functions
├── App.vue                # Root component
└── main.ts                # Application entry point
```

## 🚀 Features

### Authentication

- User registration with validation
- Login with JWT token management
- Secure token storage in localStorage
- Protected routes with automatic redirects
- Auto-login after registration

### Products

- Browse all products with search functionality
- View detailed product information
- Stock availability display
- Responsive product grid layout

### Shopping Cart

- Add products with quantity selection
- Update item quantities
- Remove items from cart
- Real-time total calculation
- Cart persistence

### Checkout

- Shipping address form
- Payment information (demo mode)
- Order summary review
- Success confirmation

### Orders

- View order history
- Order status tracking
- Cancel orders (within 7 days)
- Order details

## 🛠️ Tech Stack

- **Vue 3**: Progressive JavaScript framework
- **TypeScript**: Type-safe development
- **Pinia**: State management
- **Vue Router**: Client-side routing with guards
- **Axios**: HTTP client with interceptors
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Lightning-fast build tool

## 📋 Prerequisites

- Node.js 20.19.0 or higher
- npm or yarn

## ⚙️ Setup & Installation

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Configure API Endpoint**

   Update `.env` file:

   ```env
   VITE_API_URL=http://localhost:8080/api
   VITE_APP_NAME=ByteCart
   ```

3. **Start Development Server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

4. **Build for Production**

   ```bash
   npm run build
   ```

5. **Type Checking**

   ```bash
   npm run type-check
   ```

6. **Format Code**
   ```bash
   npm run format
   ```

## 🔐 Security Features

### JWT Token Management

- Automatic token attachment to all requests via Axios interceptor
- Token refresh on 401 responses
- Secure localStorage storage
- Auto logout on token expiration

### Protected Routes

- Navigation guards for authenticated routes
- Redirect to login for unauthorized access
- Return to original page after login
- Guest-only routes (login/register)

### Input Validation

- Client-side form validation
- Email format validation
- Password confirmation
- Field error messages

## 📱 Responsive Design

All pages are fully responsive:

- **Mobile**: Single column layout, touch-friendly
- **Tablet**: Two column grids
- **Desktop**: Multi-column layouts with sidebars

## 🎯 SOLID Principles Implementation

### Single Responsibility

- Components handle only presentation logic
- Business logic isolated in stores/composables
- API calls centralized in api modules

### Open/Closed

- Extensible component prop system
- Pluggable middleware support
- Store actions are easily extendable

### Liskov Substitution

- Consistent component prop interfaces
- Homogeneous store action signatures

### Interface Segregation

- Minimal required props per component
- Typed API responses and requests
- Well-defined store interfaces

### Dependency Injection

- Vue's injection system for global state
- Composable functions for shared logic
- Centralized API client

## 📦 API Integration

### Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Current user info

### Products

- `GET /products` - List all products
- `GET /products/{id}` - Get product details

### Cart

- `GET /cart` - Get user cart
- `POST /cart/add` - Add item to cart
- `PUT /cart/update/{itemId}` - Update item quantity
- `DELETE /cart/remove/{itemId}` - Remove item
- `POST /cart/checkout/{cartItemId}` - Checkout

### Orders

- `GET /orders` - Get user orders
- `GET /orders/{id}` - Get order details
- `PUT /orders/{id}/cancel` - Cancel order

## 🧪 Type Safety

All major entities are fully typed:

```typescript
// Users
interface User {
  id: number
  username: string
}

// Products
interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
}

// Orders
interface Order {
  id: number
  userId: number
  items: OrderItem[]
  total: number
  status: OrderStatus
  createdAt: string
}
```

## 📊 Store Structure

Each Pinia store follows the Composition API pattern with:

- **State**: Reactive data
- **Computed**: Derived state
- **Actions**: Async operations and mutations

Example:

```typescript
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  // Computed
  const isAuthenticated = computed(() => !!token.value)

  // Actions
  const login = async (credentials: AuthRequest) => {
    // Implementation
  }

  return { user, token, isAuthenticated, login }
})
```

## 🎨 Component Examples

### Button Component

```vue
<Button variant="primary" :isLoading="loading">
  Submit
</Button>
```

### Card Component

```vue
<Card title="Product Name" description="Product description" :price="99.99" :stock="5">
  <!-- Content -->
</Card>
```

### Modal Component

```vue
<Modal :isOpen="showModal" title="Confirm" @close="showModal = false">
  Are you sure?
</Modal>
```

## 🐛 Error Handling

- Global error boundaries via route guards
- Try-catch blocks in all async operations
- User-friendly error messages
- Network error handling with Axios interceptors
- Validation error display on forms

## 🚀 Performance Optimizations

- Lazy-loaded route components
- Computed properties for derived state
- Efficient re-renders with Vue 3 reactivity
- CSS transitions for smooth animations
- Minified production builds

## 📚 Best Practices

- ✅ Type-safe development with TypeScript
- ✅ Composable, reusable components
- ✅ Centralized state management
- ✅ Clean API layer abstraction
- ✅ Protected routes with guards
- ✅ Responsive mobile-first design
- ✅ Accessible UI components
- ✅ Comprehensive error handling

## 🤝 Contributing

1. Create a feature branch
2. Follow the existing code structure
3. Type all code with TypeScript
4. Test your changes
5. Submit a pull request

## 📄 License

MIT

## 🆘 Support

For issues or questions, please create an issue in the repository.

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
