<script setup lang="ts">
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'
</script>

<template>
  <div class="flex min-h-screen">
    <AdminSidebar />
    <div class="flex-1 ml-56">
      <AdminHeader />
      <div class="p-6">
        <router-view />
      </div>
    </div>
  </div>
</template>
