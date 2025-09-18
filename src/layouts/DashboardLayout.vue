<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useNotificationStore } from '@/stores/notificationStore'
import { useUserStore } from '@/stores/userStore'

import AppFooter from '@/components/common/AppFooter.vue'
import AppHeader from '@/components/common/AppHeader.vue'
import AppSidebar from '@/components/common/AppSidebar.vue'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const notificationStore = useNotificationStore()
const { isSnackbarVisible, snackbarColor, resultMessage } = storeToRefs(notificationStore)

const drawer = ref(false)

const sidebarData = computed(() => {
  if (!userInfo.value) return []

  return [
    {
      title: 'Products',
      value: 'products',
      to: '/products',
    },
    {
      title: 'ShoppingCart',
      value: 'ShoppingCart',
      to: `/cart/${userInfo.value.uuid}`,
    },
    {
      title: 'User',
      value: 'user',
      to: '/user',
    },
  ]
})
</script>

<template>
  <v-layout class="d-flex flex-column" width="100vw">
    <AppHeader @toggle-sidebar="drawer = !drawer" />
    <AppSidebar v-model="drawer" :sidebar-items="sidebarData" />
    <v-main class="d-flex justify-center">
      <router-view />
    </v-main>
    <AppFooter />
    <!-- Snackbar -->
    <v-snackbar v-model="isSnackbarVisible" timeout="3000" location="top" :color="snackbarColor">
      {{ resultMessage }}
    </v-snackbar>
  </v-layout>
</template>

<style scoped></style>
