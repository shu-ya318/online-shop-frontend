<script setup lang="ts">
import type { QueryOption } from '@/views/dashboard/ProductsView.vue'

defineProps<{
  modelValue: QueryOption[]
}>()

const emit = defineEmits(['update:modelValue', 'option-changed'])

const ChangeOption = (option: QueryOption) => {
  emit('option-changed', option)
}
</script>

<template>
  <v-container class="d-flex flex-column flex-md-row align-md-center ga-2 py-0 px-4 px-md-0">
    <!-- Select options -->
    <v-select
      v-for="filter in modelValue"
      :key="filter.placeholder"
      density="compact"
      variant="outlined"
      hide-details
      clearable
      :placeholder="filter.placeholder"
      class="custom-placeholder-color"
      :style="{ width: $vuetify.display.mdAndUp ? '12rem' : '100%', flex: 'none' }"
      :items="filter.items"
      v-model="filter.model"
      @update:model-value="ChangeOption(filter)"
    ></v-select>
  </v-container>
</template>

<style scoped>
.custom-placeholder-color :deep([placeholder]::placeholder) {
  color: #000000;
  opacity: 1;
}
</style>
