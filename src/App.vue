<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import AppToast from '@/components/common/AppToast.vue'

const route = useRoute()
const auth = useAuthStore()

const isAdminRoute = computed(() => route.path.startsWith('/admin'))

onMounted(() => {
  auth.initFromStorage()
})
</script>

<template>
  <AppHeader v-if="!isAdminRoute" />
  <router-view />
  <AppFooter v-if="!isAdminRoute" />
  <AppToast />
</template>
