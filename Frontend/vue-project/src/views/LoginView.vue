<template>
  <div class="container mx-auto p-4 max-w-md">
    <h2 class="text-2xl font-bold mb-4">Login</h2>
    <form @submit.prevent="login">
      <div class="mb-4">
        <label class="block text-sm font-medium">Username</label>
        <input v-model="username" type="text" class="w-full p-2 border rounded" required />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium">Password</label>
        <input v-model="password" type="password" class="w-full p-2 border rounded" required />
      </div>
      <button type="submit" class="bg-blue-500 text-white p-2 rounded">Login</button>
    </form>
    <p class="mt-4">
      Don't have an account? <router-link to="/register" class="text-blue-500 hover:underline">Register</router-link>
    </p>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import { useToast } from 'vue-toastification'

export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async login() {
      const toast = useToast()
      try {
        await useAuthStore().login(this.username, this.password)
        toast.success('Login successful')
        this.$router.push('/dashboard')
      } catch (error) {
        toast.error(error)
      }
    }
  }
}
</script>