<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useNotification } from '@/composables/useNotification'

const { showSnackbar, snackbarColor, resultMessage } = useNotification()
</script>

<template>
  <v-app>
    <RouterView />
    <v-snackbar v-model="showSnackbar" :color="snackbarColor" :timeout="3000" location="top">
      {{ resultMessage }}
    </v-snackbar>
  </v-app>
</template>

<style scoped></style>
