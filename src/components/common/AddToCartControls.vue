<script setup lang="ts">
withDefaults(
  defineProps<{
    selectedQuantity: number
    isLoading?: boolean
  }>(),
  {
    selectedQuantity: 1,
    isLoading: false
  }
)

defineEmits<{
  (event: 'on-increment'): void
  (event: 'on-decrement'): void
}>()
</script>

<template>
  <v-sheet rounded="pill" class="d-inline-flex align-center border border-info pa-1">
    <v-btn
      variant="flat"
      icon="mdi-minus"
      size="x-small"
      color="grey-lighten-3"
      class="ma-1"
      :disabled="selectedQuantity <= 1 || isLoading"
      @click="$emit('on-decrement')"
    ></v-btn>
    <div class="px-4 text-body-1" style="min-width: 40px; text-align: center">
      <v-progress-circular
        v-if="isLoading"
        indeterminate
        size="20"
        width="2"
        color="primary"
      ></v-progress-circular>
      <span v-else>{{ selectedQuantity }}</span>
    </div>
    <v-btn
      variant="flat"
      icon="mdi-plus"
      size="x-small"
      color="grey-lighten-3"
      class="ma-1"
      :disabled="isLoading"
      @click="$emit('on-increment')"
    ></v-btn>
  </v-sheet>
</template>

<style scoped></style>
