<script setup lang="ts">
import { Form as VeeForm } from 'vee-validate'

defineProps<{
  title: string
  buttonText: string
  loading?: boolean
  disabled?: boolean
}>()

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
          <slot name="form-inputs"></slot>
          <!-- Submit button -->
          <v-btn type="submit" color="success" :block="true" :loading="loading" :disabled="disabled">
            {{ buttonText }}
          </v-btn>
        </vee-form>
      </v-card-text>
      <slot name="third-party-auths"></slot>
      <!-- Action: redirect link -->
      <v-card-actions class="d-flex justify-center pa-0" style="min-height: auto">
        <slot name="redirect-link"></slot>
      </v-card-actions>
    </v-container>
  </v-card>
</template>

<style scoped></style>
