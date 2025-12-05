<template>
  <footer class="bg-gray-50 border-t border-gray-200 mt-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Brand -->
        <div>
          <h3 class="text-lg font-bold text-gray-900">ByteCart</h3>
          <p class="mt-2 text-sm text-gray-600">Bytes of Happiness in Every Cart.</p>
        </div>

        <!-- Links -->
        <div>
          <h4 class="font-semibold text-gray-900 mb-4">Quick Links</h4>
          <ul class="space-y-2 text-sm text-gray-600">
            <li>
              <RouterLink to="/products" class="hover:text-gray-900 transition-colors"
                >Products</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/cart" class="hover:text-gray-900 transition-colors">Cart</RouterLink>
            </li>
            <li>
              <RouterLink to="/orders" class="hover:text-gray-900 transition-colors"
                >Orders</RouterLink
              >
            </li>
          </ul>
        </div>

        <!-- Info -->
        <div>
          <h4 class="font-semibold text-gray-900 mb-4">Support</h4>
          <p class="text-sm text-gray-600">Email: support@bytecart.com</p>
          <p class="text-sm text-gray-600 mt-2">© 2025 ByteCart. All rights reserved.</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer component
</script>
