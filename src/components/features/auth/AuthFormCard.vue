<script setup lang="ts">
import { Form as VeeForm } from 'vee-validate'

defineProps({
  title: {
    type: String,
    required: true,
  },
  buttonText: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['submit'])
</script>

<template>
  <v-card width="100%" max-width="32.5rem" class="ma-auto">
    <v-container class="d-flex flex-column ga-4 px-5 py-4">
      <!-- Title -->
      <v-card-title class="text-h5 text-center"> {{ title }}</v-card-title>
      <!-- Form -->
      <v-card-text>
        <vee-form @submit="$emit('submit')">
          <!-- Inputs -->
          <slot></slot>
          <!-- Submit button -->
          <v-btn type="submit" color="success" :block="true" :loading="loading">
            {{ buttonText }}
          </v-btn>
        </vee-form>
      </v-card-text>
      <!-- Action: redirect link -->
      <v-card-actions class="d-flex justify-center pa-0" style="min-height: auto;">
        <slot name="actions"></slot>
      </v-card-actions>
    </v-container>
  </v-card>
</template>

<style scoped></style>
