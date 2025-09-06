<script setup lang="ts">
import { ref } from 'vue'

import { useNotification } from '@/composables/useNotification'

import UserSetting from '@/components/dashboard/user/UserSetting.vue'
import UserOrderHistory from '@/components/dashboard/user/UserOrderHistory.vue'

import { updateUserProfile, updateUserPassword } from '@/api/user'

export interface ProfileUpdateDefaultValues {
  email: string
  name: string
  phoneNumber: string
  address: string
  birth: string
}

export interface PasswordUpdateDefaultValues {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

const { showSnackbar, snackbarColor, resultMessage, showSuccess, showError } = useNotification()

const isProfileUpdating = ref(false)
const isPasswordUpdating = ref(false)

const navigationTab = ref('setting')

const UpdateProfile = async (values: ProfileUpdateDefaultValues) => {
  isProfileUpdating.value = true

  try {
    await updateUserProfile(values)
    showSuccess('User profile updated successfully!')
  } catch (error) {
    if (error instanceof Error) {
      showError(error.message)
    } else {
      showError(String(error))
    }
  } finally {
    isProfileUpdating.value = false
  }
}

const UpdatePassword = async (values: PasswordUpdateDefaultValues) => {
  isPasswordUpdating.value = true

  try {
    const response = await updateUserPassword(values)
    showSuccess(response.message)
  } catch (error) {
    if (error instanceof Error) {
      showError(error.message)
    } else {
      showError(String(error))
    }
  } finally {
    isPasswordUpdating.value = false
  }
}
</script>

<template>
  <v-container>
    <v-card color="background" class="px-6">
      <!-- Navigation Tabs -->
      <v-tabs color="success" class="my-4" v-model="navigationTab">
        <v-tab value="setting"> Setting </v-tab>
        <v-tab value="order"> Order History </v-tab>
      </v-tabs>
      <v-card-text>
        <v-window v-model="navigationTab">
          <!-- Setting -->
          <v-window-item value="setting">
            <user-setting
              :is-profile-updating="isProfileUpdating"
              :is-password-updating="isPasswordUpdating"
              @update-profile="UpdateProfile"
              @update-password="UpdatePassword"
            />
          </v-window-item>
          <!-- Order History -->
          <v-window-item value="order">
            <user-order-history />
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-container>
  <!-- Snackbar -->
  <v-snackbar timeout="3000" location="top" :color="snackbarColor" v-model="showSnackbar">
    {{ resultMessage }}
  </v-snackbar>
</template>

<style scoped>
:deep(.v-tabs .v-tab) {
  border-radius: 0 !important;
}
</style>
