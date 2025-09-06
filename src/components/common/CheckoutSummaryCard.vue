<script setup lang="ts">
defineProps<{
  title: string
  buttonText: string
  buttonLoading?: boolean
  subtotal: number
  shipping: string | number
  total: number
}>()

defineEmits<{
  (event: 'button-click'): void
}>()
</script>

<template>
  <v-card class="border-sm border-info pa-6">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <slot name="product-items"></slot>
      <!-- Charge -->
      <div class="mt-5 mb-5">
        <!-- Subtotal -->
        <div class="d-flex justify-space-between text-body-2 text-secondary mb-2">
          <span>Subtotal:</span>
          <span class="text-primary">${{ subtotal || '0' }}</span>
        </div>
        <v-divider color="info" class="my-2"></v-divider>
        <!-- Shipping -->
        <div class="d-flex justify-space-between text-body-2 text-secondary mb-2">
          <span>Shipping:</span>
          <span class="text-primary">
            {{ typeof shipping === 'number' ? `$${shipping}` : shipping || 'Free' }}
          </span>
        </div>
        <v-divider color="info" class="my-2"></v-divider>
        <!-- Total -->
        <div class="d-flex justify-space-between text-subtitle-1 text-secondary">
          <span>Total:</span>
          <span class="text-primary font-weight-bold">${{ total || '0' }}</span>
        </div>
      </div>
      <slot name="payment-method"></slot>
    </v-card-text>
    <!-- Button -->
    <v-card-actions>
      <v-btn color="success" :block="true" :loading="buttonLoading" @click="$emit('button-click')">
        {{ buttonText }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped></style>
