<script setup lang="ts">
import { ref, computed } from 'vue'

const drawer = ref(false)

defineExpose({
  toggle: () => {
    drawer.value = !drawer.value
  },
})

const sidebarData = computed(() => {
  return [
    {
      title: 'Products',
      value: 'products',
      to: '/products',
    },
    {
      title: 'Cart',
      value: 'Cart',
      to: '/cart',
    },
    {
      title: 'User',
      value: 'user',
      to: '/user',
    },
  ]
})
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    :location="$vuetify.display.mobile ? 'bottom' : undefined"
    temporary
  >
    <v-list>
      <v-list-item v-for="item in sidebarData" :key="item.value" :to="item.to" :value="item.value">
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped></style>
