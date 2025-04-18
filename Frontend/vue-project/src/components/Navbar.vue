<template>
  <nav class="bg-blue-600 text-white p-4">
    <div class="container mx-auto flex justify-between">
      <router-link to="/" class="text-lg font-bold">Finance Tracker</router-link>
      <div>
        <router-link v-if="!isLoggedIn" to="/login" class="mr-4">Login</router-link>
        <router-link v-if="!isLoggedIn" to="/register">Register</router-link>
        <router-link v-if="isLoggedIn" to="/dashboard" class="mr-4">Dashboard</router-link>
        <router-link v-if="isLoggedIn && isAdmin" to="/admin" class="mr-4">Admin</router-link>
        <button v-if="isLoggedIn" @click="logout" class="text-white">Logout</button>
      </div>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
  computed: {
    isLoggedIn() {
      return !!useAuthStore().token
    },
    isAdmin() {
      return useAuthStore().role === 'admin'
    }
  },
  methods: {
    logout() {
      useAuthStore().logout()
      this.$router.push('/login')
    }
  }
}
</script>