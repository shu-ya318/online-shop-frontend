<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useUserStore } from '@/stores/userStore'
import { useNotificationStore } from '@/stores/notificationStore'

const router = useRouter()

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const { logout } = useUserStore()

const { showSuccess, showError } = useNotificationStore()

defineEmits<{
  (event: 'toggle-sidebar'): void
}>()

const onLogout = async () => {
  try {
    const response = await logout()
    showSuccess(response.message)
    setTimeout(() => {
      router.push({ name: 'home' })
    }, 500)
  } catch (error) {
    if (error instanceof Error) {
      showError(error.message)
    } else {
      showError(String(error))
    }
  }
}

const menuData = computed(() => [
  { title: 'My Account', icon: 'mdi-account-box-outline', to: '/user' },
  {
    title: userInfo.value ? 'Log out' : 'Login',
    icon: userInfo.value ? 'mdi-logout' : 'mdi-login',
    action: userInfo.value ? onLogout : () => router.push({ name: 'login' }),
  },
])
</script>

<template>
  <v-app-bar elevation="0" color="primary">
    <div class="w-100 d-flex align-center mx-auto" style="max-width: 75rem">
      <!-- Toggle Sidebar -->
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
            v-for="item in menuData"
            :key="item.title"
            :value="item.title"
            :to="item.to"
            @click="item.action"
          >
            <template v-slot:prepend>
              <v-icon color="#000000" :icon="item.icon"></v-icon>
            </template>
            <v-list-item-title class="text-body-2 font-weight-medium">{{
              item.title
            }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <!-- Cart -->
      <RouterLink custom v-slot="{ navigate }" :to="{ name: 'cart' }">
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
