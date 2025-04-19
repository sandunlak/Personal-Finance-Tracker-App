<template>
  <div style="max-width: 1200px; margin: 0 auto; padding: 2rem;">
    <h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; color: #1a365d;">
      {{ isEditing ? 'Edit Budget' : 'Add New Budget' }}
    </h2>
    
    <div style="background: white; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); padding: 1.5rem; margin-bottom: 2rem;">
      <form @submit.prevent="isEditing ? updateBudget() : addBudget()">
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #4a5568; margin-bottom: 0.5rem;">Account</label>
          <select
            v-model="budget.accountId"
            required
            style="width: 100%; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 0.375rem; background-color: #f8fafc; transition: all 0.2s; outline: none;"
            :style="{ 'border-color': budget.accountId ? '#3182ce' : '#e2e8f0', 'box-shadow': budget.accountId ? '0 0 0 2px rgba(49, 130, 206, 0.2)' : 'none' }"
          >
            <option value="" disabled>Select an account</option>
            <option v-for="acc in accounts" :key="acc._id" :value="acc._id">
              {{ acc.accname }} ({{ acc.acctype }} - {{ acc.currency }} {{ acc.accvalue.toFixed(2) }})
            </option>
          </select>
        </div>
        
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #4a5568; margin-bottom: 0.5rem;">Budget Name</label>
          <input
            v-model="budget.name"
            type="text"
            required
            style="width: 100%; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 0.375rem; background-color: #f8fafc; transition: all 0.2s; outline: none;"
            :style="{ 'border-color': budget.name ? '#3182ce' : '#e2e8f0', 'box-shadow': budget.name ? '0 0 0 2px rgba(49, 130, 206, 0.2)' : 'none' }"
            placeholder="Enter budget name"
          />
        </div>
        
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #4a5568; margin-bottom: 0.5rem;">Category</label>
          <select
            v-model="budget.categories"
            required
            style="width: 100%; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 0.375rem; background-color: #f8fafc; transition: all 0.2s; outline: none;"
            :style="{ 'border-color': budget.categories ? '#3182ce' : '#e2e8f0', 'box-shadow': budget.categories ? '0 0 0 2px rgba(49, 130, 206, 0.2)' : 'none' }"
          >
            <option value="" disabled>Select category</option>
            <option value="vehicle">Vehicle</option>
            <option value="food">Food</option>
            <option value="transport">Transport</option>
          </select>
        </div>
        
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #4a5568; margin-bottom: 0.5rem;">Amount</label>
          <input
            v-model="budget.amount"
            type="number"
            step="0.01"
            required
            style="width: 100%; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 0.375rem; background-color: #f8fafc; transition: all 0.2s; outline: none;"
            :style="{ 'border-color': budget.amount ? '#3182ce' : '#e2e8f0', 'box-shadow': budget.amount ? '0 0 0 2px rgba(49, 130, 206, 0.2)' : 'none' }"
            placeholder="Enter budget amount"
          />
        </div>
        
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #4a5568; margin-bottom: 0.5rem;">Currency</label>
          <select
            v-model="budget.currency"
            required
            style="width: 100%; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 0.375rem; background-color: #f8fafc; transition: all 0.2s; outline: none;"
            :style="{ 'border-color': budget.currency ? '#3182ce' : '#e2e8f0', 'box-shadow': budget.currency ? '0 0 0 2px rgba(49, 130, 206, 0.2)' : 'none' }"
          >
            <option value="" disabled>Select currency</option>
            <option value="lkr">LKR</option>
            <option value="usd">USD</option>
          </select>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #4a5568; margin-bottom: 0.5rem;">Period</label>
          <select
            v-model="budget.period"
            required
            style="width: 100%; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 0.375rem; background-color: #f8fafc; transition: all 0.2s; outline: none;"
            :style="{ 'border-color': budget.period ? '#3182ce' : '#e2e8f0', 'box-shadow': budget.period ? '0 0 0 2px rgba(49, 130, 206, 0.2)' : 'none' }"
          >
            <option value="" disabled>Select period</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
            <option value="onetime">One-time</option>
          </select>
        </div>
        
        <div style="display: flex; gap: 0.5rem;">
          <button
            type="submit"
            style="background-color: #38a169; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 500; transition: all 0.2s; border: none; cursor: pointer;"
            :style="{ 'background-color': isEditing ? '#3182ce' : '#38a169', '&:hover': { backgroundColor: isEditing ? '#2c5282' : '#2f855a' } }"
          >
            {{ isEditing ? 'Update Budget' : 'Add Budget' }}
          </button>
          <button
            @click="$router.push('/dashboard')"
            type="button"
            style="background-color: #718096; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 500; transition: all 0.2s; border: none; cursor: pointer;"
            :hover="{ backgroundColor: '#4a5568' }"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Display All Budgets -->
    <div style="background: white; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); padding: 1.5rem;">
      <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #1a365d;">Your Budgets</h3>
      
      <div v-if="loading" style="color: #718096; text-align: center; padding: 1rem;">
        Loading budgets...
      </div>
      
      <div v-else-if="budgets.length > 0" style="display: grid; gap: 1rem;">
        <div
          v-for="budget in budgets"
          :key="budget._id"
          style="border: 1px solid #e2e8f0; padding: 1rem; border-radius: 0.375rem; display: flex; justify-content: space-between; align-items: center; background-color: #f8fafc; transition: all 0.2s;"
          :hover="{ backgroundColor: '#edf2f7' }"
        >
          <div>
            <p style="margin-bottom: 0.5rem;"><strong style="color: #4a5568;">Name:</strong> <span style="color: #2d3748;">{{ budget.name }}</span></p>
            <p style="margin-bottom: 0.5rem;"><strong style="color: #4a5568;">Account:</strong> <span style="color: #2d3748;">{{ getAccountName(budget.account) }}</span></p>
            <p style="margin-bottom: 0.5rem;"><strong style="color: #4a5568;">Category:</strong> <span style="color: #2d3748;">{{ budget.categories }}</span></p>
            <p style="margin-bottom: 0.5rem;"><strong style="color: #4a5568;">Amount:</strong> <span style="color: #2d3748;">{{ budget.currency }} {{ budget.amount.toFixed(2) }}</span></p>
            <p style="margin-bottom: 0;"><strong style="color: #4a5568;">Period:</strong> <span style="color: #2d3748;">{{ budget.period }}</span></p>
          </div>
          
          <div style="display: flex; gap: 0.5rem;">
            <button
              @click="editBudget(budget)"
              style="background-color: #3182ce; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 500; transition: all 0.2s; border: none; cursor: pointer;"
              :hover="{ backgroundColor: '#2b6cb0' }"
            >
              Edit
            </button>
            <button
              @click="deleteBudget(budget._id)"
              style="background-color: #e53e3e; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 500; transition: all 0.2s; border: none; cursor: pointer;"
              :hover="{ backgroundColor: '#c53030' }"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      
      <p v-else style="color: #718096; padding: 1rem; text-align: center;">
        No budgets found.
      </p>
    </div>

    <!-- Overspent Popup -->
    <div
      v-if="showOverspentPopup"
      style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 50;"
    >
      <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); max-width: 400px; width: 100%;">
        <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 1rem; color: #1a365d;">Budget Overspent</h3>
        <p style="margin-bottom: 1.5rem; color: #4a5568;">Budget is overspent! Please adjust the account balance.</p>
        <button
          @click="showOverspentPopup = false"
          style="background-color: #3182ce; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 500; transition: all 0.2s; border: none; cursor: pointer; width: 100%;"
          :hover="{ backgroundColor: '#2b6cb0' }"
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