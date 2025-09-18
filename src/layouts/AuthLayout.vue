<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useNotificationStore } from '@/stores/notificationStore'

import backgroundImage from '@/assets/images/backgroundImage.png'

const notificationStore = useNotificationStore()
const { isSnackbarVisible, snackbarColor, resultMessage } = storeToRefs(notificationStore)
</script>

<template>
  <v-img width="100vw" height="100vh" cover :src="backgroundImage">
    <v-container fluid class="d-flex justify-center align-center pa-7">
      <router-view />
    </v-container>
  </v-img>
  <!-- Snackbar -->
  <v-snackbar v-model="isSnackbarVisible" timeout="3000" location="top" :color="snackbarColor">
    {{ resultMessage }}
  </v-snackbar>
</template>

<style scoped></style>
