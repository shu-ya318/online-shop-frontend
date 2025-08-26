<script setup lang="ts">
const model = defineModel('')

withDefaults(
  defineProps<{
    loading?: boolean
  }>(),
  {
    loading: false,
  }
)

defineEmits<{
  (event: 'submit'): void
}>()
</script>

<template>
  <v-container fluid height="3rem" class="pa-0">
    <div class="w-100 h-100 d-flex align-center mx-auto" style="max-width: 30rem">
      <!-- Input -->
      <v-text-field v-model="model" hide-details flex-grow rounded="sm" density="comfortable" class="rounded-e-0"
        variant="outlined" placeholder="Search" type="search" @keydown.enter.prevent="$emit('submit')" />
      <!-- Submit button -->
      <v-btn width="4.25rem" height="100%" color="success" rounded="lg" class="rounded-s-0" :loading="loading"
        @click="$emit('submit')">
        <v-icon color="background">mdi-magnify</v-icon>
      </v-btn>
    </div>
  </v-container>
</template>

<style scoped></style>
