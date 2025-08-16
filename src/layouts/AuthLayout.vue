<script setup lang="ts">
import backgroundImage from '@/assets/images/backgroundImage.png'
</script>

<template>
  <v-img width="100vw" cover :src="backgroundImage">
    <v-container fluid class="d-flex justify-center align-center pa-7">
      <router-view />
    </v-container>
  </v-img>
</template>

<style scoped></style>
