<script setup lang="ts">
import { useRouter } from 'vue-router'

import { useUserStore } from '@/stores/userStore'

import { useNotification } from '@/composables/useNotification'

const router = useRouter()

const { showSuccess, showError } = useNotification()

defineEmits<{
  (event: 'toggle-sidebar'): void
}>()

const { logout, userInfo } = useUserStore()

const handleLogout = async () => {
  try {
    await logout()
    showSuccess('Logout successful!')
    setTimeout(() => {
      router.push({ name: 'home' })
    }, 500)
  } catch (error) {
    showError(error as string)
  }
}

const menuItems = [
  { title: 'My Account', icon: 'mdi-account-box-outline', to: '/user' },
  { title: 'Log out', icon: 'mdi-logout', action: handleLogout },
]
</script>

<template>
  <v-app-bar :elevation="0" color="primary">
    <div class="w-100 d-flex align-center mx-auto" style="max-width: 75rem">
      <!-- Sidebar toggle -->
      <v-app-bar-nav-icon
        color="background"
        variant="text"
        @click="$emit('toggle-sidebar')"
      ></v-app-bar-nav-icon>
      <!-- Logo -->
      <RouterLink custom v-slot="{ navigate }" to="/home">
        <v-toolbar-title class="text-white ml-2" style="cursor: pointer" @click="navigate">
          Online Shop
        </v-toolbar-title>
      </RouterLink>
      <v-spacer></v-spacer>
      <!-- User -->
      <v-menu>
        <template #activator="{ props }">
          <v-btn icon variant="plain" v-bind="props" color="background" active-color="white">
            <v-icon color="background">mdi-account-outline</v-icon>
          </v-btn>
        </template>
        <!-- Menu items -->
        <v-list nav>
          <v-list-item
            v-for="item in menuItems"
            :key="item.title"
            :value="item.title"
            :to="item.to"
            :prepend-icon="item.icon"
            @click="item.action"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <!-- Cart -->
      <RouterLink custom v-slot="{ navigate }" :to="`/cart/${userInfo?.uuid}`">
        <v-btn icon variant="plain" color="background" active-color="white" @click="navigate">
          <v-icon color="background">mdi-cart-outline</v-icon>
        </v-btn>
      </RouterLink>
    </div>
  </v-app-bar>
</template>

<style scoped>
:deep(.v-list-item__prepend) {
  display: block;
}
</style>
