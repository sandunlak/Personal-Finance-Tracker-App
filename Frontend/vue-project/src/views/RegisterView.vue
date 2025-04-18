<template>
  <div class="container mx-auto p-4 max-w-md">
    <h2 class="text-2xl font-bold mb-4">Register</h2>
    <form @submit.prevent="register">
      <div class="mb-4">
        <label class="block text-sm font-medium">Username</label>
        <input v-model="username" type="text" class="w-full p-2 border rounded" required />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium">Email</label>
        <input v-model="email" type="email" class="w-full p-2 border rounded" required />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium">Password</label>
        <input v-model="password" type="password" class="w-full p-2 border rounded" required />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium">Photo (optional)</label>
        <input type="file" @change="handleFileUpload" class="w-full p-2 border rounded" />
      </div>
      <button type="submit" class="bg-blue-500 text-white p-2 rounded">Register</button>
    </form>
    <p class="mt-4">
      Already have an account? <router-link to="/login" class="text-blue-500 hover:underline">Login</router-link>
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
      email: '',
      password: '',
      photo: null
    }
  },
  methods: {
    handleFileUpload(event) {
      this.photo = event.target.files[0]
    },
    async register() {
      const toast = useToast()
      try {
        await useAuthStore().register(this.username, this.email, this.password, this.photo)
        toast.success('Registration successful')
        this.$router.push('/login')
      } catch (error) {
        toast.error(error)
      }
    }
  }
}
</script>