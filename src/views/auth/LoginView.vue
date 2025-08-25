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

interface LoginForm {
  email: string
  password: string
}

const schema = z.object({
  email: z.string(), //z.string().email({ message: 'Must be a valid email' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(20, { message: 'Password must be at most 20 characters' }),
})

const { handleSubmit, defineField, errors, isSubmitting } = useForm<LoginForm>({
  initialValues: {
    email: '',
    password: '',
  },
  validationSchema: toTypedSchema(schema),
})

const [email] = defineField('email')
const [password] = defineField('password')

const router = useRouter()

const { login } = useUserStore()

const { showSnackbar, snackbarColor, resultMessage, showSuccess, showError } = useNotification()

const showPassword = ref(false)

const loading = ref(false)

const onSubmit = handleSubmit(async (values) => {
  try {
    await login(values)
    showSuccess('Login success!')
    setTimeout(() => {
      router.push({ name: 'home' })
    }, 500)
  } catch (error) {
    showError(error as string)
  }
})

const loginWithGoogle = () => {
  loading.value = true
  window.location.href = `http://localhost:8081/oauth2/authorization/google`
}
</script>

<template>
  <!-- Form -->
  <auth-form-card title="Login" button-text="Login with email" :loading="isSubmitting" @submit="onSubmit">
    <!-- Inputs -->
    <form-input label="Email" v-model="email" :error-messages="errors.email"></form-input>
    <form-input label="Password" v-model="password" :type="showPassword ? 'text' : 'password'"
      :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" :error-messages="errors.password"
      @click:append-inner="showPassword = !showPassword"></form-input>
    <!-- Login with Google -->
    <v-btn prepend-icon="mdi-google" color="accent" class="mb-4" :block="true" :loading="loading"
      @click="loginWithGoogle">Login
      with Google</v-btn>
    <!-- Redirect link -->
    <template #actions>
      <router-link class="text-decoration-none text-primary bg-transparent" :to="{ name: 'register' }">
        Don't have account?
        <span style="color: #000000; font-weight: bold">Register</span>
      </router-link>
    </template>
  </auth-form-card>
  <!-- Snackbar -->
  <v-snackbar v-model="showSnackbar" :color="snackbarColor" :timeout="3000" location="top">
    {{ resultMessage }}
  </v-snackbar>
</template>

<style scoped></style>
