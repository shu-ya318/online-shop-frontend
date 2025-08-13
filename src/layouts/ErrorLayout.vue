<script setup lang="ts">
import backgroundImage from '@/assets/images/backgroundImage.png'
</script>

<template>
  <v-img height="100vh" width="100vw" cover :src="backgroundImage">
    <v-container height="100%" fluid class="d-flex justify-center align-center">
      <router-view />
    </v-container>
  </v-img>
</template>

<style scoped></style>
