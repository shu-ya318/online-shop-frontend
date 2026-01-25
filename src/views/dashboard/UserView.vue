<script setup lang="ts">
import { ref } from 'vue'

import UserSetting from '@/components/dashboard/user/UserSetting.vue'
import UserOrderHistory from '@/components/dashboard/user/UserOrderHistory.vue'

const navigationTab = ref('setting')
</script>

<template>
  <v-container>
    <v-card color="background" class="px-6">
      <!-- Navigation Tabs -->
      <v-tabs color="success" class="w-100 d-flex align-center mx-auto my-4" v-model="navigationTab" style="max-width: 75rem">
        <v-tab value="setting"> Setting </v-tab>
        <v-tab value="order"> Order History </v-tab>
      </v-tabs>
      <v-card-text>
        <v-window v-model="navigationTab">
          <!-- Setting -->
          <v-window-item value="setting">
            <user-setting />
          </v-window-item>
          <!-- Order History -->
          <v-window-item value="order">
            <user-order-history />
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
:deep(.v-tabs .v-tab) {
  border-radius: 0 !important;
}
</style>
