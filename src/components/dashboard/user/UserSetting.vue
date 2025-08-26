<script setup lang="ts">
import { ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

import { useUserStore } from '@/stores/userStore'

import UserFormCard from '@/components/dashboard/user/UserFormCard.vue'
import FormInput from '@/components/common/FormInput.vue'

import type {
  ProfileUpdateDefaultValues,
  PasswordUpdateDefaultValues,
} from '@/views/dashboard/UserView.vue'

defineProps<{
  isProfileUpdating: boolean
  isPasswordUpdating: boolean
}>()

const emit = defineEmits<{
  (event: 'update-profile', values: ProfileUpdateDefaultValues): void
  (event: 'update-password', values: PasswordUpdateDefaultValues): void
}>()

const updateProfileSchema = z.object({
  email: z.string(),
  name: z.string().min(1, 'Name is required'),
  phoneNumber: z
    .string()
    .min(10, { message: 'Phone number must be 10 digits' })
    .max(10, { message: 'Phone number must be 10 digits' }),
  address: z.string().min(1, 'Address is required'),
  birth: z
    .string()
    .min(1, { message: 'Birth is required' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Birth must be in yyyy-MM-dd format' }),
})

const updatePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(20, { message: 'Password must be at most 20 characters long' }),
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(20, { message: 'Password must be at most 20 characters long' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(20, { message: 'Password must be at most 20 characters long' }),
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      })
    }
  })

const userStore = useUserStore()

const {
  errors: profileErrors,
  defineField: defineProfileField,
  handleSubmit: handleProfileSubmit,
  resetForm: resetProfileForm,
} = useForm<ProfileUpdateDefaultValues>({
  initialValues: {
    email: '',
    name: '',
    phoneNumber: '',
    address: '',
    birth: '',
  },
  validationSchema: toTypedSchema(updateProfileSchema),
})

const {
  errors: passwordErrors,
  defineField: definePasswordField,
  handleSubmit: handlePasswordSubmit,
} = useForm<PasswordUpdateDefaultValues>({
  initialValues: {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  },
  validationSchema: toTypedSchema(updatePasswordSchema),
})

// Profile
const [email] = defineProfileField('email')
const [name] = defineProfileField('name')
const [phoneNumber] = defineProfileField('phoneNumber')
const [address] = defineProfileField('address')
const [birth] = defineProfileField('birth')
// Password
const [oldPassword] = definePasswordField('oldPassword')
const [newPassword] = definePasswordField('newPassword')
const [confirmPassword] = definePasswordField('confirmPassword')

const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

watch(
  () => userStore.userInfo,
  (userInfo) => {
    if (userInfo) {
      resetProfileForm({
        values: {
          email: userInfo.email,
          name: userInfo.name,
          phoneNumber: userInfo.phoneNumber,
          address: userInfo.address,
          birth: userInfo.birth,
        },
      })
    }
  },
  { deep: true, immediate: true }
)

const onProfileUpdate = handleProfileSubmit(async (values) => {
  emit('update-profile', values)
})

const onPasswordUpdate = handlePasswordSubmit(async (values) => {
  emit('update-password', values)
})
</script>

<template>
  <!-- Profile Setting Form -->
  <user-form-card class="mb-4" title="Profile Setting" button-text="Save Changes" :loading="isProfileUpdating"
    @submit="onProfileUpdate">
    <v-row>
      <!-- Email -->
      <v-col cols="12" style="padding-top: 0.25rem; padding-bottom: 0">
        <v-label class="text-caption text-primary">Email</v-label>
        <form-input v-model="email" readonly variant="solo-filled"></form-input>
      </v-col>
      <!-- Name -->
      <v-col cols="12" style="padding-top: 0.25rem; padding-bottom: 0">
        <v-label class="text-caption text-primary" :required="true">Name</v-label>
        <form-input v-model="name" :error-messages="profileErrors.name"></form-input>
      </v-col>
      <!-- Birth -->
      <v-col cols="12" style="padding-top: 0.25rem; padding-bottom: 0">
        <v-label class="text-caption text-primary" :required="true">Birth</v-label>
        <form-input v-model="birth" :error-messages="profileErrors.birth"></form-input>
      </v-col>
      <!-- Phone Number -->
      <v-col cols="12" style="padding-top: 0.25rem; padding-bottom: 0">
        <v-label class="text-caption text-primary" :required="true">Phone Number</v-label>
        <form-input v-model="phoneNumber" :error-messages="profileErrors.phoneNumber"></form-input>
      </v-col>
      <!-- Address -->
      <v-col cols="12" style="padding-bottom: 1.5rem">
        <v-label class="text-caption text-primary" :required="true">Address</v-label>
        <form-input v-model="address" :error-messages="profileErrors.address"></form-input>
      </v-col>
    </v-row>
  </user-form-card>
  <!-- Change Password Form -->
  <user-form-card title="Change Password" button-text="Change Password" :loading="isPasswordUpdating"
    @submit="onPasswordUpdate">
    <v-row>
      <!-- Old Password -->
      <v-col cols="12" class="pt-2 pb-0">
        <v-label class="text-caption text-primary" :required="true">Old Password</v-label>
        <form-input v-model="oldPassword" :type="showOldPassword ? 'text' : 'password'"
          :append-inner-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'" :error-messages="passwordErrors.oldPassword"
          @click:append-inner="showOldPassword = !showOldPassword"></form-input>
      </v-col>
      <!-- New Password -->
      <v-col cols="12" class="pt-2 pb-0">
        <v-label class="text-caption text-primary" :required="true">New Password</v-label>
        <form-input v-model="newPassword" :type="showNewPassword ? 'text' : 'password'"
          :append-inner-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'" :error-messages="passwordErrors.newPassword"
          @click:append-inner="showNewPassword = !showNewPassword"></form-input>
      </v-col>
      <!-- Confirm Password -->
      <v-col cols="12" class="pb-6">
        <v-label class="text-caption text-primary" :required="true">Confirm Password</v-label>
        <form-input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
          :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :error-messages="passwordErrors.confirmPassword"
          @click:append-inner="showConfirmPassword = !showConfirmPassword"></form-input>
      </v-col>
    </v-row>
  </user-form-card>
</template>

<style scoped></style>
