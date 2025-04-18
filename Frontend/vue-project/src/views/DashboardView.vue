<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">User Dashboard</h2>
    <div v-if="user" class="mb-4 bg-white shadow-md rounded p-4">
      <h3 class="text-xl font-semibold">Profile</h3>
      <p><strong>Name:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Role:</strong> {{ user.role }}</p>
      <div class="mt-2 space-x-2">
        <button @click="showUpdateForm = true" class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Update Profile</button>
        <button @click="deleteAccount" class="bg-red-500 text-white p-2 rounded hover:bg-red-600">Delete Account</button>
        <button @click="$router.push('/add-account')" class="bg-green-500 text-white p-2 rounded hover:bg-green-600">Add Account</button>
        <button @click="$router.push('/add-budget')" class="bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600">Add Budget</button>
      </div>
    </div>

    <!-- Update Profile Form -->
    <div v-if="showUpdateForm" class="mb-4 bg-white shadow-md rounded p-4">
      <h3 class="text-xl font-semibold mb-2">Update Profile</h3>
      <form @submit.prevent="updateProfile">
        <div class="mb-4">
          <label class="block text-sm font-medium">Name</label>
          <input v-model="updateForm.name" type="text" class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Email</label>
          <input v-model="updateForm.email" type="email" class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
        </div>
        <div class="flex space-x-2">
          <button type="submit" class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Save</button>
          <button @click="showUpdateForm = false" class="bg-gray-500 text-white p-2 rounded hover:bg-gray-600">Cancel</button>
        </div>
      </form>
    </div>

    <TransactionList :transactions="details.transactions" />
    <GoalList :goals="details.goals" />
    <BudgetList :budgets="details.budgets" />
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import TransactionList from '../components/TransactionList.vue'
import GoalList from '../components/GoalList.vue'
import BudgetList from '../components/BudgetList.vue'

export default {
  components: { TransactionList, GoalList, BudgetList },
  data() {
    return {
      user: null,
      details: { transactions: [], goals: [], budgets: [] },
      showUpdateForm: false,
      updateForm: { name: '', email: '' }
    }
  },
  async mounted() {
    const toast = useToast()
    try {
      const authStore = useAuthStore()
      this.user = authStore.user
      if (!this.user) await authStore.fetchUser()
      this.user = authStore.user

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/my-details`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
      this.details = response.data
      this.updateForm = { name: this.user.name, email: this.user.email }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load dashboard')
      this.$router.push('/login')
    }
  },
  methods: {
    async updateProfile() {
      const toast = useToast()
      try {
        await useAuthStore().updateUser(this.updateForm)
        toast.success('Profile updated')
        this.showUpdateForm = false
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to update profile')
      }
    },
    async deleteAccount() {
      const toast = useToast()
      if (confirm('Are you sure you want to delete your account?')) {
        try {
          await useAuthStore().deleteUser()
          toast.success('Account deleted')
          this.$router.push('/login')
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to delete account')
        }
      }
    }
  }
}
</script>