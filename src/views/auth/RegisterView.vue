<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

import { useUserStore } from '@/stores/userStore'
import { useNotificationStore } from '@/stores/notificationStore'

import AuthFormCard from '@/components/auth/AuthFormCard.vue'
import FormInput from '@/components/common/FormInput.vue'

const RegisterSchema = z
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
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    birth: z.string().optional(),
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

type Register = z.infer<typeof RegisterSchema>

const { register } = useUserStore()

const { handleSubmit, defineField, errors, isSubmitting } = useForm<Register>({
  initialValues: {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birth: '',
    phoneNumber: '',
    address: '',
  },
  validationSchema: toTypedSchema(RegisterSchema),
})

const [name] = defineField('name')
const [email] = defineField('email')
const [birth] = defineField('birth')
const [phoneNumber] = defineField('phoneNumber')
const [address] = defineField('address')
const [password] = defineField('password')
const [confirmPassword] = defineField('confirmPassword')

const router = useRouter()

const { showSuccess, showError } = useNotificationStore()

const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const birthMenu = ref(false)

const onRegister = handleSubmit(async (values) => {
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

const onBirthChange = (newDate: Date) => {
  const year = newDate.getFullYear()
  const month = String(newDate.getMonth() + 1).padStart(2, '0')
  const day = String(newDate.getDate()).padStart(2, '0')

  birth.value = `${year}-${month}-${day}`
  birthMenu.value = false
}
</script>

<template>
  <!-- Form -->
  <auth-form-card
    title="Register"
    button-text="Register"
    :loading="isSubmitting"
    :disabled="isSubmitting"
    @submit="onRegister"
  >
    <!-- Inputs -->
    <template #form-inputs>
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
        :type="isPasswordVisible ? 'text' : 'password'"
        :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
        v-model="password"
        :error-messages="errors.password"
        @click:append-inner="isPasswordVisible = !isPasswordVisible"
        :required="true"
      ></form-input>
      <form-input
        label="Confirm Password"
        placeholder="Please enter the password again"
        :type="isConfirmPasswordVisible ? 'text' : 'password'"
        :append-inner-icon="isConfirmPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
        v-model="confirmPassword"
        :error-messages="errors.confirmPassword"
        @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
        :required="true"
      ></form-input>
      <v-menu v-model="birthMenu" :close-on-content-click="false" transition="scale-transition">
        <template v-slot:activator="{ props }">
          <form-input
            label="Birth"
            placeholder="Please select your birth date"
            v-model="birth"
            :error-messages="errors.birth"
            readonly
            v-bind="props"
          ></form-input>
        </template>
        <v-date-picker
          :model-value="birth ? new Date(birth) : new Date()"
          @update:model-value="onBirthChange"
          title="Select birth date"
          color="primary"
        ></v-date-picker>
      </v-menu>
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
    </template>
    <!-- Redirect link -->
    <template #redirect-link>
      <router-link class="text-decoration-none text-primary bg-transparent" :to="{ name: 'login' }">
        Already have account?
        <span style="color: #000000; font-weight: bold">Login</span>
      </router-link>
    </template>
  </auth-form-card>
</template>

<style scoped></style>
