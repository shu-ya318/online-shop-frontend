<script setup lang="ts">
import { Form as VeeForm } from 'vee-validate'

defineProps<{
  title: string
  buttonText: string
  loading?: boolean
}>()

defineEmits(['submit'])
</script>

<template>
  <v-card width="100%" max-width="75rem" class="border-sm border-info mx-auto mb-8">
    <v-container class="d-flex flex-column justify-center pa-0">
      <!-- Title -->
      <v-card-title class="border-b-sm border-info text-h6 text-left" style="padding: 1rem 1.5rem">
        {{ title }}</v-card-title
      >
      <!-- Form -->
      <v-card-text style="padding: 1.75rem 1.5rem">
        <vee-form @submit="$emit('submit')">
          <!-- Inputs -->
          <slot></slot>
          <!-- Submit button -->
          <v-btn :loading="loading" type="submit" color="success" class="text-subtitle-2">
            {{ buttonText }}
          </v-btn>
        </vee-form>
      </v-card-text>
    </v-container>
  </v-card>
</template>

<style scoped></style>
