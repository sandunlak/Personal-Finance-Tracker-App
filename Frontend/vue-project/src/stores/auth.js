import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null
  }),
  actions: {
    async login(username, password) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/login`, {
          name: username,
          password
        })
        this.token = response.data.token
        this.role = response.data.role || 'user'
        localStorage.setItem('token', this.token)
        localStorage.setItem('role', this.role)
        await this.fetchUser()
      } catch (error) {
        throw error.response?.data?.message || 'Login failed'
      }
    },
    async register(username, email, password, photo) {
      try {
        const formData = new FormData()
        formData.append('name', username)
        formData.append('email', email)
        formData.append('password', password)
        if (photo) formData.append('photo', photo)

        const url = `${import.meta.env.VITE_API_URL}/api/users/register`
        console.log('Registering at:', url) // Debug log
        await axios.post(url, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } catch (error) {
        console.error('Registration error:', error.response) // Debug log
        throw error.response?.data?.message || 'Registration failed'
      }
    },
    async fetchUser() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${this.token}` }
        })
        this.user = response.data
      } catch (error) {
        this.logout()
        throw error.response?.data?.message || 'Failed to fetch user'
      }
    },
    async updateUser(details) {
      try {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/me`, details, {
          headers: { Authorization: `Bearer ${this.token}` }
        })
        this.user = response.data.user
      } catch (error) {
        throw error.response?.data?.message || 'Failed to update user'
      }
    },
    async deleteUser() {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${this.token}` }
        })
        this.logout()
      } catch (error) {
        throw error.response?.data?.message || 'Failed to delete user'
      }
    },
    logout() {
      this.user = null
      this.token = null
      this.role = null
      localStorage.removeItem('token')
      localStorage.removeItem('role')
    }
  }
})