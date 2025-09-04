<script setup lang="ts">
import type { QueryOption } from '@/views/dashboard/ProductsView.vue'

defineProps<{
  modelValue: QueryOption[]
  loading?: boolean
}>()

defineEmits(['update:modelValue'])
</script>

<template>
  <v-container fluid height="2rem" class="d-flex align-center">
    <!-- Select options -->
    <v-select v-for="(filter, index) in modelValue" :key="index" density="compact" variant="outlined" hide-details
      clearable :placeholder="filter.placeholder" class="mr-2 custom-placeholder-color" :loading="loading"
      style="width: 12rem; flex: none" :items="filter.items" v-model="filter.model"
      @update:model-value="$emit('update:modelValue', modelValue)"></v-select>
  </v-container>
</template>

<style scoped>
.custom-placeholder-color :deep([placeholder]::placeholder) {
  color: #000000;
  opacity: 1;
}
</style>
