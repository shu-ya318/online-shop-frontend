<script setup lang="ts">
import { computed } from 'vue'

interface SidebarItem {
  title: string
  value: string
  to: string
}

const props = defineProps<{
  modelValue: boolean
  sidebarItems: SidebarItem[]
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

const drawer = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>

<template>
  <v-navigation-drawer v-model="drawer" :location="$vuetify.display.mobile ? 'bottom' : undefined" temporary>
    <v-list>
      <v-list-item v-for="item in props.sidebarItems" :key="item.value" :to="item.to" :value="item.value">
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped></style>
