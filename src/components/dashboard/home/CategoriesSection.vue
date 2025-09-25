<script setup lang="ts">
import { useRouter } from 'vue-router'

import { Category } from '@/types/common/enum'

import vegetablesImage from '@/assets/images/vegetables.png'
import fruitsImage from '@/assets/images/fruits.png'
import proteinImage from '@/assets/images/protein.png'
import grainsImage from '@/assets/images/grains.png'

const categoryData = [
  {
    name: 'Vegetables',
    value: Category.VEGETABLES,
    image: vegetablesImage,
  },
  {
    name: 'Fruits',
    value: Category.FRUITS,
    image: fruitsImage,
  },
  {
    name: 'Protein',
    value: Category.PROTEIN,
    image: proteinImage,
  },
  {
    name: 'Grains',
    value: Category.GRAINS,
    image: grainsImage,
  },
]

const router = useRouter()

const onNavigateToProductsWithCategory = (category: Category) => {
  router.push({ name: 'products', query: { category } })
}
</script>

<template>
  <v-container class="pa-0">
    <div class="underline-title mb-10 text-h5 text-primary font-weight-bold text-center">
      Categories
    </div>
    <v-row class="ga-9">
      <v-col v-for="item in categoryData" :key="item.name"
        class="category-item d-flex flex-column justify-center align-center border-md border-accent rounded pt-2 pb-2 ps-1 ga-4"
        @click="onNavigateToProductsWithCategory(item.value)">
        <v-img width="4rem" height="4rem" :src="item.image" />
        <div class="category-item-text text-subtitle-1 text-center text-accent">
          {{ item.name }}
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.underline-title {
  text-decoration: underline;
  text-decoration-color: rgb(var(--v-theme-success));
  text-underline-offset: 0.8rem;
}

.category-item {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.category-item:hover {
  background-color: rgb(var(--v-theme-accent));
}

.category-item:hover .category-item-text {
  color: rgb(var(--v-theme-surface)) !important;
}
</style>
