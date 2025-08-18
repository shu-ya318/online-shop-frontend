<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

import AuthFormCard from '@/components/features/auth/AuthFormCard.vue'
import FormInput from '@/components/common/baseUiElements/FormInput.vue'

import { useUserStore } from '@/stores/userStore'

interface defaultValues {
  email: string
  password: string
}

const formSchema = z.object({
  email: z.string().email({ message: 'Must be a valid email' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(20, { message: 'Password must be at most 20 characters' }),
})

const { handleSubmit, defineField, errors, isSubmitting } = useForm<defaultValues>({
  initialValues: {
    email: '',
    password: '',
  },
  validationSchema: toTypedSchema(formSchema),
})

const [email] = defineField('email')
const [password] = defineField('password')

const authStore = useUserStore()

const showPassword = ref(false)

const onSubmit = handleSubmit(async (values) => {
  await authStore.login(values)
})
</script>

<template>
  <!-- Form -->
  <auth-form-card title="Login" button-text="Login" :loading="isSubmitting" @submit="onSubmit">
    <!-- Inputs -->
    <form-input label="Email" v-model="email" :error-messages="errors.email"></form-input>
    <form-input label="Password" v-model="password" :type="showPassword ? 'text' : 'password'"
      :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" :error-messages="errors.password"
      @click:append-inner="showPassword = !showPassword"></form-input>
    <!-- Redirect link -->
    <template #actions>
      <router-link class="text-decoration-none text-primary bg-transparent" :to="{ name: 'register' }">
        Don't have account?
        <span style="color: #000000; font-weight: bold">Register</span>
      </router-link>
    </template>
  </auth-form-card>
</template>

<style scoped></style>
