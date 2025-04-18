<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">Admin Panel</h2>
    <h3 class="text-xl font-semibold mb-2">All Users</h3>
    <ul>
      <li v-for="user in users" :key="user._id" class="border p-2 mb-2 flex justify-between">
        <span>{{ user.name }} ({{ user.email }}) - {{ user.role }}</span>
        <div>
          <button @click="editUser(user)" class="bg-blue-500 text-white p-1 rounded mr-2">Edit</button>
          <button @click="deleteUser(user._id)" class="bg-red-500 text-white p-1 rounded">Delete</button>
        </div>
      </li>
    </ul>

    <!-- Edit User Form -->
    <div v-if="showEditForm" class="mb-4 bg-white shadow-md rounded p-4">
      <h3 class="text-xl font-semibold mb-2">Edit User</h3>
      <form @submit.prevent="updateUser">
        <div class="mb-4">
          <label class="block text-sm font-medium">Name</label>
          <input v-model="editForm.name" type="text" class="w-full p-2 border rounded" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Email</label>
          <input v-model="editForm.email" type="email" class="w-full p-2 border rounded" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Role</label>
          <select v-model="editForm.role" class="w-full p-2 border rounded">
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="courseProvider">Course Provider</option>
          </select>
        </div>
        <button type="submit" class="bg-blue-500 text-white p-2 rounded">Save</button>
        <button @click="showEditForm = false" class="bg-gray-500 text-white p-2 rounded ml-2">Cancel</button>
      </form>
    </div>

    <h3 class="text-xl font-semibold mb-2">Financial Summary</h3>
    <div v-for="(summary, userId) in financialSummary" :key="userId" class="border p-2 mb-2 bg-white shadow-md rounded">
      <p><strong>User ID:</strong> {{ userId }}</p>
      <p><strong>Total Income:</strong> {{ summary.totalIncome }}</p>
      <p><strong>Total Expenses:</strong> {{ summary.totalExpenses }}</p>
      <p><strong>Net Balance:</strong> {{ summary.netBalance }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { useToast } from 'vue-toastification'

export default {
  data() {
    return {
      users: [],
      financialSummary: {},
      showEditForm: false,
      editForm: { id: '', name: '', email: '', role: '' }
    }
  },
  async mounted() {
    const toast = useToast()
    try {
      const token = localStorage.getItem('token')
      const [usersResponse, summaryResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/all-users-summary`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])
      this.users = usersResponse.data
      this.financialSummary = summaryResponse.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load admin data')
      this.$router.push('/login')
    }
  },
  methods: {
    editUser(user) {
      this.editForm = { id: user._id, name: user.name, email: user.email, role: user.role }
      this.showEditForm = true
    },
    async updateUser() {
      const toast = useToast()
      try {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/users/${this.editForm.id}`,
          {
            name: this.editForm.name,
            email: this.editForm.email,
            role: this.editForm.role
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        )
        this.users = this.users.map(user =>
          user._id === this.editForm.id ? { ...user, ...this.editForm } : user
        )
        toast.success('User updated')
        this.showEditForm = false
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to update user')
      }
    },
    async deleteUser(userId) {
      const toast = useToast()
      if (confirm('Are you sure you want to delete this user?')) {
        try {
          await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
          this.users = this.users.filter(user => user._id !== userId)
          toast.success('User deleted')
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to delete user')
        }
      }
    }
  }
}
</script>