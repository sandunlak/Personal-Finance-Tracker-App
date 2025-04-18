<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">{{ isEditing ? 'Edit Budget' : 'Add New Budget' }}</h2>
    <div class="bg-white shadow-md rounded p-4 mb-6">
      <form @submit.prevent="isEditing ? updateBudget() : addBudget()">
        <div class="mb-4">
          <label class="block text-sm font-medium">Account</label>
          <select
            v-model="budget.accountId"
            required
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Select an account</option>
            <option v-for="acc in accounts" :key="acc._id" :value="acc._id">
              {{ acc.accname }} ({{ acc.acctype }} - {{ acc.currency }} {{ acc.accvalue.toFixed(2) }})
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Budget Name</label>
          <input
            v-model="budget.name"
            type="text"
            required
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Enter budget name"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Category</label>
          <select
            v-model="budget.categories"
            required
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Select category</option>
            <option value="vehicle">Vehicle</option>
            <option value="food">Food</option>
            <option value="transport">Transport</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Amount</label>
          <input
            v-model="budget.amount"
            type="number"
            step="0.01"
            required
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Enter budget amount"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Currency</label>
          <select
            v-model="budget.currency"
            required
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Select currency</option>
            <option value="lkr">LKR</option>
            <option value="usd">USD</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Period</label>
          <select
            v-model="budget.period"
            required
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Select period</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
            <option value="onetime">One-time</option>
          </select>
        </div>
        <div class="flex space-x-2">
          <button
            type="submit"
            class="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            {{ isEditing ? 'Update Budget' : 'Add Budget' }}
          </button>
          <button
            @click="$router.push('/dashboard')"
            class="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Display All Budgets -->
    <div class="bg-white shadow-md rounded p-4">
      <h3 class="text-xl font-semibold mb-4">Your Budgets</h3>
      <div v-if="loading" class="text-gray-500 text-center">
        Loading budgets...
      </div>
      <div v-else-if="budgets.length > 0" class="space-y-4">
        <div
          v-for="budget in budgets"
          :key="budget._id"
          class="border p-4 rounded flex justify-between items-center bg-gray-50 hover:bg-gray-100"
        >
          <div>
            <p><strong>Name:</strong> {{ budget.name }}</p>
            <p><strong>Account:</strong> {{ getAccountName(budget.account) }}</p>
            <p><strong>Category:</strong> {{ budget.categories }}</p>
            <p><strong>Amount:</strong> {{ budget.currency }} {{ budget.amount.toFixed(2) }}</p>
            <p><strong>Period:</strong> {{ budget.period }}</p>
          </div>
          <div class="flex space-x-2">
            <button
              @click="editBudget(budget)"
              class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              @click="deleteBudget(budget._id)"
              class="bg-red-500 text-white p-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <p v-else class="text-gray-500">No budgets found.</p>
    </div>

    <!-- Overspent Popup -->
    <div
      v-if="showOverspentPopup"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded shadow-lg">
        <h3 class="text-lg font-bold mb-4">Budget Overspent</h3>
        <p class="mb-4">Budget is overspent! Please adjust the account balance.</p>
        <button
          @click="showOverspentPopup = false"
          class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import axios from 'axios'
import { useToast } from 'vue-toastification'

export default {
  data() {
    return {
      budget: {
        accountId: '',
        name: '',
        categories: '',
        amount: null,
        currency: '',
        period: ''
      },
      accounts: [],
      budgets: [],
      isEditing: false,
      editingBudgetId: null,
      loading: false,
      showOverspentPopup: false
    }
  },
  async mounted() {
    await Promise.all([this.fetchAccounts(), this.fetchBudgets()])
  },
  methods: {
    async addBudget() {
      const toast = useToast()
      try {
        this.loading = true
        const authStore = useAuthStore()
        if (!authStore.token) {
          toast.error('Please log in to add a budget')
          this.$router.push('/login')
          return
        }

        const payload = {
          name: this.budget.name,
          period: this.budget.period,
          amount: Number(this.budget.amount),
          currency: this.budget.currency,
          categories: [this.budget.categories], // Backend expects array
          accountId: this.budget.accountId
        }

        const response = await axios.post(
          'http://localhost:8000/Budget/addbudget',
          payload,
          {
            headers: { Authorization: `Bearer ${authStore.token}` }
          }
        )

        toast.success('Budget added successfully')
        await this.fetchBudgets()
        this.resetForm()
      } catch (error) {
        if (error.response?.data?.message?.includes('overspent')) {
          this.showOverspentPopup = true
        } else {
          toast.error(error.response?.data?.error || 'Failed to add budget')
        }
      } finally {
        this.loading = false
      }
    },
    async updateBudget() {
      const toast = useToast()
      try {
        this.loading = true
        const authStore = useAuthStore()
        if (!authStore.token) {
          toast.error('Please log in to update a budget')
          this.$router.push('/login')
          return
        }

        const payload = {
          name: this.budget.name,
          period: this.budget.period,
          amount: Number(this.budget.amount),
          currency: this.budget.currency,
          categories: [this.budget.categories], // Backend expects array
          accountId: this.budget.accountId
        }

        const response = await axios.put(
          `http://localhost:8000/Budget/updatebudget/${this.editingBudgetId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${authStore.token}` }
          }
        )

        toast.success('Budget updated successfully')
        await this.fetchBudgets()
        this.resetForm()
      } catch (error) {
        if (error.response?.data?.message?.includes('overspent')) {
          this.showOverspentPopup = true
        } else {
          toast.error(error.response?.data?.error || 'Failed to update budget')
        }
      } finally {
        this.loading = false
      }
    },
    async deleteBudget(budgetId) {
      const toast = useToast()
      if (!confirm('Are you sure you want to delete this budget?')) return

      try {
        this.loading = true
        const authStore = useAuthStore()
        if (!authStore.token) {
          toast.error('Please log in to delete a budget')
          this.$router.push('/login')
          return
        }

        await axios.delete(
          `http://localhost:8000/Budget/deletebudget/${budgetId}`,
          {
            headers: { Authorization: `Bearer ${authStore.token}` }
          }
        )

        toast.success('Budget deleted successfully')
        await this.fetchBudgets()
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to delete budget')
      } finally {
        this.loading = false
      }
    },
    async fetchAccounts() {
      const toast = useToast()
      try {
        const authStore = useAuthStore()
        if (!authStore.token) {
          toast.error('Please log in to view accounts')
          return
        }

        const response = await axios.get(
          'http://localhost:8000/Addaccount/showacc',
          {
            headers: { Authorization: `Bearer ${authStore.token}` }
          }
        )

        this.accounts = response.data || []
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to fetch accounts')
        this.accounts = []
      }
    },
    async fetchBudgets() {
      const toast = useToast()
      this.loading = true
      try {
        const authStore = useAuthStore()
        if (!authStore.token) {
          toast.error('Please log in to view budgets')
          this.$router.push('/login')
          return
        }

        const response = await axios.get(
          'http://localhost:8000/Budget/showbudget',
          {
            headers: { Authorization: `Bearer ${authStore.token}` }
          }
        )

        this.budgets = response.data || []
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to fetch budgets')
        this.budgets = []
      } finally {
        this.loading = false
      }
    },
    editBudget(budget) {
      this.isEditing = true
      this.editingBudgetId = budget._id
      this.budget = {
        accountId: budget.account._id || budget.account,
        name: budget.name,
        categories: budget.categories[0], // Backend returns array, select first
        amount: budget.amount,
        currency: budget.currency,
        period: budget.period
      }
    },
    getAccountName(account) {
      if (!account) return 'Unknown'
      const acc = typeof account === 'object' ? account : this.accounts.find(acc => acc._id === account)
      return acc ? `${acc.accname} (${acc.acctype})` : 'Unknown'
    },
    resetForm() {
      this.budget = {
        accountId: '',
        name: '',
        categories: '',
        amount: null,
        currency: '',
        period: ''
      }
      this.isEditing = false
      this.editingBudgetId = null
      this.showOverspentPopup = false
    }
  }
}
</script>