<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

import { useUserStore } from '@/stores/userStore'
import { useNotification } from '@/composables/useNotification'

import AuthFormCard from '@/components/auth/AuthFormCard.vue'
import FormInput from '@/components/common/FormInput.vue'

interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
  birth: string
  phoneNumber: string
  address: string
}

const schema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Must be a valid email' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(20, { message: 'Password must be at most 20 characters long' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(20, { message: 'Password must be at most 20 characters long' }),
    phoneNumber: z.string(),
    address: z.string(),
    birth: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      })
    }
  })

const { register } = useUserStore()

const { handleSubmit, defineField, errors, isSubmitting } = useForm<RegisterForm>({
  initialValues: {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birth: '',
    phoneNumber: '',
    address: '',
  },
  validationSchema: toTypedSchema(schema),
})

const [name] = defineField('name')
const [email] = defineField('email')
const [birth] = defineField('birth')
const [phoneNumber] = defineField('phoneNumber')
const [address] = defineField('address')
const [password] = defineField('password')
const [confirmPassword] = defineField('confirmPassword')

const router = useRouter()

const { showSnackbar, snackbarColor, resultMessage, showSuccess, showError } = useNotification()

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const onSubmit = handleSubmit(async (values) => {
  try {
    const response = await register(values)
    showSuccess(response.message)
    setTimeout(() => {
      router.push({ name: 'login' })
    }, 500)
  } catch (error) {
    if (error instanceof Error) {
      showError(error.message)
    } else {
      showError(String(error))
    }
  }
})
</script>

<template>
  <!-- Form -->
  <auth-form-card
    title="Register"
    button-text="Register"
    :loading="isSubmitting"
    @submit="onSubmit"
  >
    <!-- Inputs -->
    <form-input
      label="Name"
      placeholder="Please enter your name"
      v-model="name"
      :error-messages="errors.name"
      :required="true"
    ></form-input>
    <form-input
      label="Email"
      placeholder="Please enter a valid email address"
      v-model="email"
      :error-messages="errors.email"
      :required="true"
    ></form-input>
    <form-input
      label="Password"
      placeholder="Please enter 8-20 characters"
      :type="showPassword ? 'text' : 'password'"
      :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
      v-model="password"
      :error-messages="errors.password"
      @click:append-inner="showPassword = !showPassword"
      :required="true"
    ></form-input>
    <form-input
      label="Confirm Password"
      placeholder="Please enter the password again"
      :type="showConfirmPassword ? 'text' : 'password'"
      :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
      v-model="confirmPassword"
      :error-messages="errors.confirmPassword"
      @click:append-inner="showConfirmPassword = !showConfirmPassword"
      :required="true"
    ></form-input>
    <form-input
      label="Birth"
      placeholder="Please enter your birth date (yyyy-MM-dd)"
      v-model="birth"
      :error-messages="errors.birth"
    ></form-input>
    <form-input
      label="Phone Number"
      placeholder="Please enter 10 digits"
      v-model="phoneNumber"
      :error-messages="errors.phoneNumber"
    ></form-input>
    <form-input
      label="Address"
      placeholder="Please enter your address"
      v-model="address"
      :error-messages="errors.address"
    ></form-input>
    <!-- Redirect link -->
    <template #actions>
      <router-link class="text-decoration-none text-primary bg-transparent" :to="{ name: 'login' }">
        Already have account?
        <span style="color: #000000; font-weight: bold">Login</span>
      </router-link>
    </template>
  </auth-form-card>
  <!-- Snackbar -->
  <v-snackbar v-model="showSnackbar" :color="snackbarColor" :timeout="3000" location="top">
    {{ resultMessage }}
  </v-snackbar>
</template>

<style scoped></style>
