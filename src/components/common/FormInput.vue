<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  label: {
    type: String,
  },
  modelValue: {
    type: String,
    default: '',
  },
  errorMessages: {
    type: [String, Array] as PropType<string | string[]>,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])
const updateValue = (value: string) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <v-text-field variant="outlined" density="compact" class="mb-2" :label="label" :type="type" :placeholder="placeholder"
    v-bind="$attrs" :model-value="modelValue" :error-messages="errorMessages" @update:model-value="updateValue">
  </v-text-field>
</template>
