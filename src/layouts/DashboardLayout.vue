<script setup lang="ts">
import { ref, computed } from 'vue'

import { useUserStore } from '@/stores/userStore'

import AppFooter from '@/components/common/AppFooter.vue'
import AppHeader from '@/components/common/AppHeader.vue'
import AppSidebar from '@/components/common/AppSidebar.vue'

const { userInfo } = useUserStore()
const drawer = ref(false)

const sidebarItems = computed(() => [
  {
    title: 'Products',
    value: 'products',
    to: '/products',
  },
  {
    title: 'ShoppingCart',
    value: 'ShoppingCart',
    to: `/cart/${userInfo?.uuid}`,
  },
  {
    title: 'User',
    value: 'user',
    to: '/user',
  },
])
</script>

<template>
  <v-layout class="d-flex flex-column" width="100vw">
    <AppHeader @toggle-sidebar="drawer = !drawer" />
    <AppSidebar v-model="drawer" :sidebar-items="sidebarItems" />
    <v-main  class="d-flex justify-center">
      <router-view />
    </v-main>
    <AppFooter />
  </v-layout>
</template>

<style scoped></style>
