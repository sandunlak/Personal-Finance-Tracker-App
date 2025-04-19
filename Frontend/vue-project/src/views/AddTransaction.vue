<template>
  <div style="max-width: 1200px; margin: 0 auto; padding: 2rem; font-family: 'Inter', sans-serif; background-color: #f5f7fa;">
    <!-- Add Transaction Form -->
    <h2 style="font-size: 2.5rem; font-weight: 700; color: #1a202c; margin-bottom: 2rem;">Add Transaction</h2>
    <div style="background-color: #ffffff; border-radius: 1rem; padding: 2rem; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); margin-bottom: 2rem;">
      <form @submit.prevent="addTransaction">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
          <div>
            <label style="display: block; font-size: 1.25rem; font-weight: 500; color: #2d3748; margin-bottom: 0.5rem;">Amount</label>
            <input 
              v-model.number="form.value" 
              type="number" 
              step="0.01" 
              style="width: 100%; padding: 0.75rem; font-size: 1.1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; transition: all 0.2s; outline: none;"
              required 
            />
          </div>
          <div>
            <label style="display: block; font-size: 1.25rem; font-weight: 500; color: #2d3748; margin-bottom: 0.5rem;">Type</label>
            <select 
              v-model="form.transtype" 
              style="width: 100%; padding: 0.75rem; font-size: 1.1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; background-color: #fff; transition: all 0.2s; outline: none;"
              required
            >
              <option value="" disabled>Select Type</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 1.25rem; font-weight: 500; color: #2d3748; margin-bottom: 0.5rem;">Category</label>
            <select 
              v-model="form.category" 
              style="width: 100%; padding: 0.75rem; font-size: 1.1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; background-color: #fff; transition: all 0.2s; outline: none;"
              required
            >
              <option value="" disabled>Select Category</option>
              <option value="food">Food</option>
              <option value="transportation">Transportation</option>
              <option value="entertainment">Entertainment</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 1.25rem; font-weight: 500; color: #2d3748; margin-bottom: 0.5rem;">Account</label>
            <select 
              v-model="form.accountId" 
              style="width: 100%; padding: 0.75rem; font-size: 1.1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; background-color: #fff; transition: all 0.2s; outline: none;"
              required
            >
              <option value="" disabled>Select Account</option>
              <option v-if="accounts.length === 0" disabled>No accounts available</option>
              <option v-for="account in accounts" :key="account._id" :value="account._id">
                {{ account.accname }} ({{ account.accvalue }})
              </option>
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 1.25rem; font-weight: 500; color: #2d3748; margin-bottom: 0.5rem;">Description</label>
            <input 
              v-model="form.description" 
              type="text" 
              style="width: 100%; padding: 0.75rem; font-size: 1.1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; transition: all 0.2s; outline: none;"
              required 
            />
          </div>
          <div>
            <label style="display: block; font-size: 1.25rem; font-weight: 500; color: #2d3748; margin-bottom: 0.5rem;">Tags (Ctrl+Click to select multiple)</label>
            <select 
              v-model="form.tags" 
              multiple
              style="width: 100%; padding: 0.75rem; font-size: 1.1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; background-color: #fff; height: 8rem; transition: all 0.2s; outline: none;"
            >
              <option v-for="tag in availableTags" :key="tag" :value="tag">
                {{ tag }}
              </option>
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 1.25rem; font-weight: 500; color: #2d3748; margin-bottom: 0.5rem;">Date</label>
            <input 
              v-model="form.date" 
              type="date" 
              style="width: 100%; padding: 0.75rem; font-size: 1.1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; transition: all 0.2s; outline: none;"
              required 
            />
          </div>
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
          <button 
            type="submit" 
            style="background-color: #3b82f6; color: #fff; padding: 0.75rem 1.5rem; font-size: 1.1rem; border-radius: 0.5rem; transition: background-color 0.2s; outline: none;"
            :disabled="!form.accountId || accounts.length === 0"
          >
            Add Transaction
          </button>
          <button 
            type="button" 
            @click="resetForm" 
            style="background-color: #6b7280; color: #fff; padding: 0.75rem 1.5rem; font-size: 1.1rem; border-radius: 0.5rem; transition: background-color 0.2s; outline: none;"
          >
            Clear
          </button>
        </div>
      </form>
    </div>

    <!-- Filter Transactions -->
    <h2 style="font-size: 2.5rem; font-weight: 700; color: #1a202c; margin-bottom: 2rem;">Filter Transactions</h2>
    <div style="background-color: #ffffff; border-radius: 1rem; padding: 2rem; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); margin-bottom: 2rem;">
      <form @submit.prevent="filterTransactions">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
          <div>
            <label style="display: block; font-size: 1.25rem; font-weight: 500; color: #2d3748; margin-bottom: 0.5rem;">Tags (comma-separated)</label>
            <input 
              v-model="filterForm.tags" 
              type="text" 
              style="width: 100%; padding: 0.75rem; font-size: 1.1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; transition: all 0.2s; outline: none;"
              placeholder="e.g., groceries, urgent"
            />
          </div>
          <div>
            <label style="display: block; font-size: 1.25rem; font-weight: 500; color: #2d3748; margin-bottom: 0.5rem;">Start Date</label>
            <input 
              v-model="filterForm.startDate" 
              type="date" 
              style="width: 100%; padding: 0.75rem; font-size: 1.1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; transition: all 0.2s; outline: none;"
            />
          </div>
          <div>
            <label style="display: block; font-size: 1.25rem; font-weight: 500; color: #2d3748; margin-bottom: 0.5rem;">End Date</label>
            <input 
              v-model="filterForm.endDate" 
              type="date" 
              style="width: 100%; padding: 0.75rem; font-size: 1.1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; transition: all 0.2s; outline: none;"
            />
          </div>
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
          <button 
            type="submit" 
            style="background-color: #3b82f6; color: #fff; padding: 0.75rem 1.5rem; font-size: 1.1rem; border-radius: 0.5rem; transition: background-color 0.2s; outline: none;"
          >
            Filter
          </button>
          <button 
            type="button" 
            @click="resetFilter" 
            style="background-color: #6b7280; color: #fff; padding: 0.75rem 1.5rem; font-size: 1.1rem; border-radius: 0.5rem; transition: background-color 0.2s; outline: none;"
          >
            Clear Filter
          </button>
        </div>
      </form>
    </div>

    <!-- Transactions List -->
    <h2 style="font-size: 2.5rem; font-weight: 700; color: #1a202c; margin-bottom: 2rem;">Transactions</h2>
    <div style="background-color: #ffffff; border-radius: 1rem; padding: 2rem; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
      <div v-if="transactions.length === 0" style="text-align: center; color: #6b7280; font-size: 1.25rem;">
        No transactions found
      </div>
      <div v-else style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div 
          v-for="transaction in transactions" 
          :key="transaction._id" 
          style="border: 1px solid #e2e8f0; padding: 1.5rem; border-radius: 0.75rem; display: flex; justify-content: space-between; align-items: center; background-color: #fafafa;"
        >
          <div style="font-size: 1.1rem; color: #2d3748;">
            <p><strong>Amount:</strong> {{ transaction.value }}</p>
            <p><strong>Type:</strong> {{ transaction.transtype }}</p>
            <p><strong>Category:</strong> {{ transaction.category }}</p>
            <p><strong>Description:</strong> {{ transaction.description }}</p>
            <p><strong>Account:</strong> {{ getAccountName(transaction.accountId) }}</p>
            <p><strong>Tags:</strong> {{ transaction.tags.join(', ') }}</p>
            <p><strong>Date:</strong> {{ formatDate(transaction.date) }}</p>
          </div>
          <div style="display: flex; gap: 1rem;">
            <button 
              @click="editTransaction(transaction)" 
              style="background-color: #f59e0b; color: #fff; padding: 0.75rem 1.5rem; font-size: 1.1rem; border-radius: 0.5rem; transition: background-color 0.2s; outline: none;"
            >
              Edit
            </button>
            <button 
              @click="deleteTransaction(transaction._id)" 
              style="background-color: #ef4444; color: #fff; padding: 0.75rem 1.5rem; font-size: 1.1rem; border-radius: 0.5rem; transition: background-color 0.2s; outline: none;"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Update Transaction Modal -->
    <div v-if="showUpdateForm" style="position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center;">
      <div style="background-color: #ffffff; border-radius: 1rem; padding: 2rem; width: 100%; max-width: 600px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);">
        <h3 style="font-size: 1.75rem; font-weight: 600; color: #1a202c; margin-bottom: 1.5rem;">Update Transaction</h3>
        <form @submit.prevent="updateTransaction">
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-size: 1.25rem; font-weight: 500; color: #2d3748; margin-bottom: 0.5rem;">Amount</label>
            <input 
              v-model.number="updateForm.value" 
              type="number" 
              step="0.01" 
              style="width: 100%; padding: 0.75rem; font-size: 1.1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; transition: all 0.2s; outline: none;"
              required 
            />
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-size: 1.25rem; font-weight: 500; color: #2d3748; margin-bottom: 0.5rem;">Type</label>
            <select 
              v-model="updateForm.transtype" 
              style="width: 100%; padding: 0.75rem; font-size: 1.1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; background-color: #fff; transition: all 0.2s; outline: none;"
              required
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-size: 1.25rem; font-weight: 500; color: #2d3748; margin-bottom: 0.5rem;">Category</label>
            <select 
              v-model="updateForm.category" 
              style="width: 100%; padding: 0.75rem; font-size: 1.1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; background-color: #fff; transition: all 0.2s; outline: none;"
              required
            >
              <option value="food">Food</option>
              <option value="transportation">Transportation</option>
              <option value="entertainment">Entertainment</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-size: 1.25rem; font-weight: 500; color: #2d3748; margin-bottom: 0.5rem;">Account</label>
            <select 
              v-model="updateForm.accountId" 
              style="width: 100%; padding: 0.75rem; font-size: 1.1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; background-color: #fff; transition: all 0.2s; outline: none;"
              required
            >
              <option value="" disabled>Select Account</option>
              <option v-if="accounts.length === 0" disabled>No accounts available</option>
              <option v-for="account in accounts" :key="account._id" :value="account._id">
                {{ account.accname }} ({{ account.accvalue }})
              </option>
            </select>
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-size: 1.25rem; font-weight: 500; color: #2d3748; margin-bottom: 0.5rem;">Description</label>
            <input 
              v-model="updateForm.description" 
              type="text" 
              style="width: 100%; padding: 0.75rem; font-size: 1.1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; transition: all 0.2s; outline: none;"
              required 
            />
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-size: 1.25rem; font-weight: 500; color: #2d3748; margin-bottom: 0.5rem;">Tags (Ctrl+Click to select multiple)</label>
            <select 
              v-model="updateForm.tags" 
              multiple
              style="width: 100%; padding: 0.75rem; font-size: 1.1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; background-color: #fff; height: 8rem; transition: all 0.2s; outline: none;"
            >
              <option v-for="tag in availableTags" :key="tag" :value="tag">
                {{ tag }}
              </option>
            </select>
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-size: 1.25rem; font-weight: 500; color: #2d3748; margin-bottom: 0.5rem;">Date</label>
            <input 
              v-model="updateForm.date" 
              type="date" 
              style="width: 100%; padding: 0.75rem; font-size: 1.1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; transition: all 0.2s; outline: none;"
              required 
            />
          </div>
          <div style="display: flex; gap: 1rem;">
            <button 
              type="submit" 
              style="background-color: #3b82f6; color: #fff; padding: 0.75rem 1.5rem; font-size: 1.1rem; border-radius: 0.5rem; transition: background-color 0.2s; outline: none;"
              :disabled="!updateForm.accountId || accounts.length === 0"
            >
              Update
            </button>
            <button 
              type="button" 
              @click="showUpdateForm = false" 
              style="background-color: #6b7280; color: #fff; padding: 0.75rem 1.5rem; font-size: 1.1rem; border-radius: 0.5rem; transition: background-color 0.2s; outline: none;"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '../stores/auth'

export default {
  data() {
    return {
      form: {
        value: null,
        transtype: '',
        category: '',
        description: '',
        accountId: '',
        tags: [],
        date: ''
      },
      updateForm: {
        id: '',
        value: null,
        transtype: '',
        category: '',
        description: '',
        accountId: '',
        tags: [],
        date: ''
      },
      filterForm: {
        tags: '',
        startDate: '',
        endDate: ''
      },
      accounts: [],
      transactions: [],
      showUpdateForm: false,
      availableTags: ['groceries', 'urgent', 'bills', 'leisure', 'travel', 'work', 'personal']
    }
  },
  computed: {
    apiUrl() {
      return 'http://localhost:8000/Transtrack'
    }
  },
  async mounted() {
    await this.fetchAccounts()
    await this.fetchTransactions()
  },
  methods: {
    async fetchAccounts() {
      const toast = useToast()
      try {
        const authStore = useAuthStore()
        const response = await axios.get('http://localhost:8000/Addaccount/showacc', {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })
        this.accounts = response.data || []
        if (this.accounts.length > 0 && !this.form.accountId) {
          this.form.accountId = this.accounts[0]._id
        } else if (this.accounts.length === 0) {
          toast.warning('No accounts found. Please add an account first.')
        }
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to fetch accounts')
        this.accounts = []
      }
    },
    async fetchTransactions() {
      const toast = useToast()
      try {
        const authStore = useAuthStore()
        const response = await axios.get(`${this.apiUrl}/showtransactions`, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })
        this.transactions = response.data || []
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to fetch transactions')
        this.transactions = []
      }
    },
    async addTransaction() {
      const toast = useToast()
      try {
        const authStore = useAuthStore()
        const payload = {
          ...this.form,
          tags: this.form.tags || []
        }
        await axios.post(`${this.apiUrl}/addtransaction`, payload, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })
        toast.success('Transaction added successfully')
        await this.fetchTransactions()
        await this.fetchAccounts()
        this.resetForm()
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to add transaction')
      }
    },
    async filterTransactions() {
      const toast = useToast()
      try {
        const authStore = useAuthStore()
        const payload = {
          tags: this.filterForm.tags ? this.filterForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : undefined,
          startDate: this.filterForm.startDate || undefined,
          endDate: this.filterForm.endDate || undefined
        }
        const response = await axios.post(`${this.apiUrl}/filtertransactions`, payload, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })
        this.transactions = response.data || []
        toast.success('Transactions filtered successfully')
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to filter transactions')
      }
    },
    async updateTransaction() {
      const toast = useToast()
      try {
        const authStore = useAuthStore()
        const payload = {
          ...this.updateForm,
          tags: this.updateForm.tags || []
        }
        await axios.put(`${this.apiUrl}/update/${this.updateForm.id}`, payload, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })
        toast.success('Transaction updated successfully')
        await this.fetchTransactions()
        await this.fetchAccounts()
        this.showUpdateForm = false
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to update transaction')
      }
    },
    async deleteTransaction(id) {
      const toast = useToast()
      if (confirm('Are you sure you want to delete this transaction?')) {
        try {
          const authStore = useAuthStore()
          await axios.delete(`${this.apiUrl}/delete/${id}`, {
            headers: { Authorization: `Bearer ${authStore.token}` }
          })
          toast.success('Transaction deleted successfully')
          await this.fetchTransactions()
          await this.fetchAccounts()
        } catch (error) {
          toast.error(error.response?.data?.error || 'Failed to delete transaction')
        }
      }
    },
    editTransaction(transaction) {
      this.updateForm = {
        id: transaction._id,
        value: transaction.value,
        transtype: transaction.transtype,
        category: transaction.category,
        description: transaction.description,
        accountId: transaction.accountId,
        tags: transaction.tags || [],
        date: transaction.date.split('T')[0]
      }
      this.showUpdateForm = true
    },
    resetForm() {
      this.form = {
        value: null,
        transtype: '',
        category: '',
        description: '',
        accountId: this.accounts.length > 0 ? this.accounts[0]._id : '',
        tags: [],
        date: ''
      }
    },
    resetFilter() {
      this.filterForm = {
        tags: '',
        startDate: '',
        endDate: ''
      }
      this.fetchTransactions()
    },
    getAccountName(accountId) {
      const account = this.accounts.find(acc => acc._id === accountId)
      return account ? account.accname : 'Unknown'
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString()
    }
  }
}
</script>