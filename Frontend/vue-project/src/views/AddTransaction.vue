<template>
  <div class="container mx-auto p-4">
    <!-- Add Transaction Form -->
    <h2 class="text-2xl font-bold mb-4">Add Transaction</h2>
    <div class="bg-white shadow-md rounded p-4 mb-6">
      <form @submit.prevent="addTransaction">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="mb-4">
            <label class="block text-sm font-medium">Amount</label>
            <input 
              v-model.number="form.value" 
              type="number" 
              step="0.01" 
              class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
              required 
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium">Type</label>
            <select 
              v-model="form.transtype" 
              class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
              required
            >
              <option value="" disabled>Select Type</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium">Category</label>
            <select 
              v-model="form.category" 
              class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
              required
            >
              <option value="" disabled>Select Category</option>
              <option value="food">Food</option>
              <option value="transportation">Transportation</option>
              <option value="entertainment">Entertainment</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium">Account</label>
            <select 
              v-model="form.accountId" 
              class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
              required
            >
              <option value="" disabled>Select Account</option>
              <option v-if="accounts.length === 0" disabled>No accounts available</option>
              <option v-for="account in accounts" :key="account._id" :value="account._id">
                {{ account.accname }} ({{ account.accvalue }})
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium">Description</label>
            <input 
              v-model="form.description" 
              type="text" 
              class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
              required 
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium">Tags (Ctrl+Click to select multiple)</label>
            <select 
              v-model="form.tags" 
              multiple
              class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 h-24"
            >
              <option v-for="tag in availableTags" :key="tag" :value="tag">
                {{ tag }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium">Date</label>
            <input 
              v-model="form.date" 
              type="date"Armor class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
              required 
            />
          </div>
        </div>
        <div class="flex space-x-2">
          <button 
            type="submit" 
            class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            :disabled="!form.accountId || accounts.length === 0"
          >
            Add Transaction
          </button>
          <button 
            type="button" 
            @click="resetForm" 
            class="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
      </form>
    </div>

    <!-- Filter Transactions -->
    <h2 class="text-2xl font-bold mb-4">Filter Transactions</h2>
    <div class="bg-white shadow-md rounded p-4 mb-6">
      <form @submit.prevent="filterTransactions">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="mb-4">
            <label class="block text-sm font-medium">Tags (comma-separated)</label>
            <input 
              v-model="filterForm.tags" 
              type="text" 
              class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
              placeholder="e.g., groceries, urgent"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium">Start Date</label>
            <input 
              v-model="filterForm.startDate" 
              type="date" 
              class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium">End Date</label>
            <input 
              v-model="filterForm.endDate" 
              type="date" 
              class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
            />
          </div>
        </div>
        <div class="flex space-x-2">
          <button 
            type="submit" 
            class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Filter
          </button>
          <button 
            type="button" 
            @click="resetFilter" 
            class="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            Clear Filter
          </button>
        </div>
      </form>
    </div>

    <!-- Transactions List -->
    <h2 class="text-2xl font-bold mb-4">Transactions</h2>
    <div class="bg-white shadow-md rounded p-4">
      <div v-if="transactions.length === 0" class="text-center text-gray-500">
        No transactions found
      </div>
      <div v-else class="space-y-4">
        <div 
          v-for="transaction in transactions" 
          :key="transaction._id" 
          class="border p-4 rounded flex justify-between items-center"
        >
          <div>
            <p><strong>Amount:</strong> {{ transaction.value }}</p>
            <p><strong>Type:</strong> {{ transaction.transtype }}</p>
            <p><strong>Category:</strong> {{ transaction.category }}</p>
            <p><strong>Description:</strong> {{ transaction.description }}</p>
            <p><strong>Account:</strong> {{ getAccountName(transaction.accountId) }}</p>
            <p><strong>Tags:</strong> {{ transaction.tags.join(', ') }}</p>
            <p><strong>Date:</strong> {{ formatDate(transaction.date) }}</p>
          </div>
          <div class="space-x-2">
            <button 
              @click="editTransaction(transaction)" 
              class="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
            >
              Edit
            </button>
            <button 
              @click="deleteTransaction(transaction._id)" 
              class="bg-red-500 text-white p-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Update Transaction Modal -->
    <div v-if="showUpdateForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded p-6 w-full max-w-md">
        <h3 class="text-xl font-semibold mb-4">_Update Transaction</h3>
        <form @submit.prevent="updateTransaction">
          <div class="mb-4">
            <label class="block text-sm font-medium">Amount</label>
            <input 
              v-model.number="updateForm.value" 
              type="number" 
              step="0.01" 
              class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
              required 
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium">Type</label>
            <select 
              v-model="updateForm.transtype" 
              class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
              required
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium">Category</label>
            <select 
              v-model="updateForm.category" 
              class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
              required
            >
              <option value="food">Food</option>
              <option value="transportation">Transportation</option>
              <option value="entertainment">Entertainment</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium">Account</label>
            <select 
              v-model="updateForm.accountId" 
              class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
              required
            >
              <option value="" disabled>Select Account</option>
              <option v-if="accounts.length === 0" disabled>No accounts available</option>
              <option v-for="account in accounts" :key="account._id" :value="account._id">
                {{ account.accname }} ({{ account.accvalue }})
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium">Description</label>
            <input 
              v-model="updateForm.description" 
              type="text" 
              class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
              required 
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium">Tags (Ctrl+Click to select multiple)</label>
            <select 
              v-model="updateForm.tags" 
              multiple
              class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 h-24"
            >
              <option v-for="tag in availableTags" :key="tag" :value="tag">
                {{ tag }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium">Date</label>
            <input 
              v-model="updateForm.date" 
              type="date" 
              class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
              required 
            />
          </div>
          <div class="flex space-x-2">
            <button 
              type="submit" 
              class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              :disabled="!updateForm.accountId || accounts.length === 0"
            >
              Update
            </button>
            <button 
              type="button" 
              @click="showUpdateForm = false" 
              class="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
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