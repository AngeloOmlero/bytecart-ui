<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'

const authStore = useAuthStore()

onMounted(() => {
  // Initialize authentication from localStorage on app load
  authStore.initializeAuth()
})
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />

    <main class="flex-grow bg-white">
      <RouterView />
    </main>

    <Footer />
  </div>
</template>

<style scoped></style>
