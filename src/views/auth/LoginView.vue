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

const LoginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Must be a valid email'),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(20, { message: 'Password must be at most 20 characters' }),
})

type Login = z.infer<typeof LoginSchema>

const { handleSubmit, defineField, errors, isSubmitting } = useForm<Login>({
  initialValues: {
    email: '',
    password: '',
  },
  validationSchema: toTypedSchema(LoginSchema),
})

const [email] = defineField('email')
const [password] = defineField('password')

const router = useRouter()

const { login } = useUserStore()

const { showSuccess, showError } = useNotificationStore()

const isPasswordVisible = ref(false)

const isLoading = ref(false)

const onLogin = handleSubmit(async (values) => {
  try {
    await login(values)
    showSuccess('Login successfully!')
    setTimeout(() => {
      router.push({ name: 'home' })
    }, 500)
  } catch (error) {
    console.log(error)
    if (error instanceof Error) {
      showError(error.message)
    } else {
      showError(String(error))
    }
  }
})

const onLoginWithGoogle = () => {
  isLoading.value = true
  window.location.href = `http://localhost:8081/oauth2/authorization/google`
}
</script>

<template>
  <!-- Form -->
  <auth-form-card title="Login" button-text="Login with email" :loading="isSubmitting" :disabled="isSubmitting"
    @submit="onLogin">
    <template #form-inputs>
      <!-- Inputs -->
      <form-input label="Email" v-model="email" :required="true" :error-messages="errors.email"></form-input>
      <form-input label="Password" v-model="password" :type="isPasswordVisible ? 'text' : 'password'" :required="true"
        :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'" :error-messages="errors.password"
        @click:append-inner="isPasswordVisible = !isPasswordVisible"></form-input>
    </template>
    <!-- Login with Google -->
    <template #third-party-auths>
      <v-divider color="info" :thickness="2">or</v-divider>
      <v-btn prepend-icon="mdi-google" color="accent" class="mb-4" :block="true" :loading="isLoading"
        :disabled="isLoading" @click="onLoginWithGoogle">Login with Google</v-btn>
    </template>
    <!-- Redirect link -->
    <template #redirect-link>
      <router-link class="text-decoration-none text-primary bg-transparent" :to="{ name: 'register' }">
        Don't have account?
        <span style="color: #000000; font-weight: bold">Register</span>
      </router-link>
    </template>
  </auth-form-card>
</template>

<style scoped></style>
