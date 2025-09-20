<script setup lang="ts">
import { useFormErrors } from 'vee-validate'

import FormInput from '@/components/common/FormInput.vue'

import type { Order } from '@/views/dashboard/OrderView.vue'

const orderNotes = defineModel<string>('orderNotes')
// User info
const userEmail = defineModel<string>('userEmail')
const username = defineModel<string>('username')
const userPhoneNumber = defineModel<string>('userPhoneNumber')
const userAddress = defineModel<string>('userAddress')
// Recipient info
const isSameAsUserInfo = defineModel<boolean>('isSameAsUserInfo')
const recipientName = defineModel<string>('recipientName')
const recipientPhoneNumber = defineModel<string>('recipientPhoneNumber')
const recipientAddress = defineModel<string>('recipientAddress')

const errors = useFormErrors<Order>()
</script>

<template>
  <v-card class="border-sm border-info pa-6">
    <v-card-title class="text-h5 pb-6">Billing Information</v-card-title>
    <v-row>
      <!-- User Info -->
      <v-card-text>User Info</v-card-text>
      <!-- Name -->
      <v-col cols="12" md="12" class="py-0">
        <v-label class="text-caption text-primary">Name</v-label>
        <form-input v-model="username" readonly variant="solo-filled"></form-input>
      </v-col>
      <!-- Email -->
      <v-col cols="12" md="12" class="py-0">
        <v-label class="text-caption text-primary">Email</v-label>
        <form-input v-model="userEmail" readonly variant="solo-filled"></form-input>
      </v-col>
      <!-- Phone Number -->
      <v-col cols="12" md="12" class="py-0">
        <v-label class="text-caption text-primary">Phone Number</v-label>
        <form-input v-model="userPhoneNumber" readonly variant="solo-filled"></form-input>
      </v-col>
      <!-- Address -->
      <v-col cols="12" class="py-0">
        <v-label class="text-caption text-primary">Address</v-label>
        <form-input v-model="userAddress" readonly variant="solo-filled"></form-input>
      </v-col>
      <!-- Recipient Info -->
      <v-card-text>Recipient Info</v-card-text>
      <!-- Checkbox : Is this the same as the user info? -->
      <v-col cols="12" md="12" class="py-0">
        <v-checkbox v-model="isSameAsUserInfo" label="same as the user info"></v-checkbox>
      </v-col>
      <!-- Name -->
      <v-col cols="12" md="6" class="py-0">
        <v-label class="text-caption text-primary" :required="true">Name</v-label>
        <form-input
          placeholder="Enter your name"
          :model-value="recipientName"
          :error-messages="errors.recipientName"
          @update:model-value="recipientName = $event"
          :disabled="isSameAsUserInfo"
        />
      </v-col>
      <!-- Phone -->
      <v-col cols="12" md="6" class="py-0">
        <v-label class="text-caption text-primary" :required="true">Phone</v-label>
        <form-input
          placeholder="Enter your phone number"
          :model-value="recipientPhoneNumber"
          :error-messages="errors.recipientPhoneNumber"
          @update:model-value="recipientPhoneNumber = $event"
          :disabled="isSameAsUserInfo"
        />
      </v-col>
      <!-- Address -->
      <v-col cols="12" class="py-0">
        <v-label class="text-caption text-primary" :required="true">Address</v-label>
        <form-input
          placeholder="Enter your address"
          :model-value="recipientAddress"
          :error-messages="errors.recipientAddress"
          @update:model-value="recipientAddress = $event"
          :disabled="isSameAsUserInfo"
        />
      </v-col>
      <!-- Order Notes -->
      <v-col cols="12" class="pt-0 pb-6">
        <v-label class="text-caption text-primary">Order Notes (Optional)</v-label>
        <v-textarea
          variant="solo"
          density="comfortable"
          placeholder="e.g. special notes for delivery"
          :model-value="orderNotes"
          :error-messages="errors.orderNotes"
          @update:model-value="orderNotes = $event"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped></style>
