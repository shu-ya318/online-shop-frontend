<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    modelValue?: string
    errorMessages?: string | string[]
    type?: string
    placeholder?: string
  }>(),
  {
    modelValue: '',
    errorMessages: '',
    type: 'text',
    placeholder: '',
  }
)

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
