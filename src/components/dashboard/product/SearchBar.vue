<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string
  loading: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
  (event: 'submit'): void
}>()

const searchTerm = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>

<template>
  <v-container height="auto" class="py-0">
    <div
      class="w-100 d-flex align-center mx-auto"
      :style="{ maxWidth: $vuetify.display.xs ? 'none' : '30rem', height: '3rem' }"
    >
      <!-- Input -->
      <v-text-field
        v-model="searchTerm"
        hide-details
        flex-grow
        rounded="sm"
        density="comfortable"
        class="rounded-e-0"
        variant="outlined"
        placeholder="Search"
        type="search"
        @keydown.enter.prevent="emit('submit')"
      />
      <!-- Submit button -->
      <v-btn
        width="4.25rem"
        height="100%"
        color="success"
        rounded="lg"
        class="rounded-s-0"
        :loading="loading"
        :disabled="loading"
        @click="emit('submit')"
      >
        <v-icon color="background">mdi-magnify</v-icon>
      </v-btn>
    </div>
  </v-container>
</template>

<style scoped></style>
