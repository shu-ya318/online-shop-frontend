<script setup lang="ts">
withDefaults(
  defineProps<{
    selectedQuantity: number
  }>(),
  {
    selectedQuantity: 1,
  },
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
      :disabled="selectedQuantity <= 1"
      @click="$emit('on-decrement')"
    ></v-btn>
    <div class="px-4 text-body-1">
      {{ selectedQuantity }}
    </div>
    <v-btn
      variant="flat"
      icon="mdi-plus"
      size="x-small"
      color="grey-lighten-3"
      class="ma-1"
      @click="$emit('on-increment')"
    ></v-btn>
  </v-sheet>
</template>

<style scoped></style>
