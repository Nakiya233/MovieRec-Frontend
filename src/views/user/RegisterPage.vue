<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Redirect: the standalone register page is handled by LoginPage's tab
// This page just redirects to /login?tab=register
const router = useRouter()
onMounted(() => {
  router.replace({ name: 'Login', query: { tab: 'register' } })
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <p class="text-sm text-[#A1A1AA]">正在跳转...</p>
  </div>
</template>
