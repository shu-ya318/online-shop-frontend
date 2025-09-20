<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useNotificationStore } from '@/stores/notificationStore'

import AppFooter from '@/components/common/AppFooter.vue'
import AppHeader from '@/components/common/AppHeader.vue'
import AppSidebar from '@/components/common/AppSidebar.vue'

const notificationStore = useNotificationStore()
const { isSnackbarVisible, snackbarColor, resultMessage } = storeToRefs(notificationStore)

const sidebarRef = ref<InstanceType<typeof AppSidebar> | null>(null)

const toggleSidebar = () => {
  if (!sidebarRef.value) return
  sidebarRef.value.toggle()
}
</script>

<template>
  <v-layout class="d-flex flex-column" width="100vw">
    <AppHeader @toggle-sidebar="toggleSidebar" />
    <AppSidebar ref="sidebarRef" />
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
