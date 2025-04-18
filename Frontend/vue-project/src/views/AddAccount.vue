<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">{{ isEditing ? 'Update Account' : 'Add New Account' }}</h2>
    <div class="bg-white shadow-md rounded p-4 mb-6">
      <form @submit.prevent="isEditing ? updateAccount() : addAccount()">
        <div class="mb-4">
          <label class="block text-sm font-medium">Account Name</label>
          <input
            v-model="account.accname"
            type="text"
            required
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Enter account name"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Account Number</label>
          <input
            v-model="account.accnumber"
            type="number"
            required
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Enter account number"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Account Type</label>
          <select
            v-model="account.acctype"
            required
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Select account type</option>
            <option value="Checking">Checking</option>
            <option value="Savings">Savings</option>
            <option value="Credit">Credit</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Account Value</label>
          <input
            v-model="account.accvalue"
            type="number"
            step="0.01"
            required
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Enter account value"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Currency</label>
          <select
            v-model="account.acccurrency"
            required
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Select currency</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="LKR">LKR</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Is Recurring?</label>
          <input
            v-model="account.isRecurring"
            type="checkbox"
            class="mr-2"
          />
          <span>Enable recurring transaction</span>
        </div>
        <div v-if="account.isRecurring" class="mb-4">
          <label class="block text-sm font-medium">Recurrence Pattern</label>
          <select
            v-model="account.recurrencePattern"
            required
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Select recurrence pattern</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div v-if="account.isRecurring" class="mb-4">
          <label class="block text-sm font-medium">End Date</label>
          <input
            v-model="account.endDate"
            type="date"
            required
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="flex space-x-2">
          <button
            type="submit"
            class="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            {{ isEditing ? 'Update Account' : 'Add Account' }}
          </button>
          <button
            @click="cancelAction"
            class="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Display All Accounts -->
    <div class="bg-white shadow-md rounded p-4">
      <h3 class="text-xl font-semibold mb-4">Your Accounts</h3>
      <div v-if="loading" class="text-gray-500 text-center">
        Loading accounts...
      </div>
      <div v-else-if="accounts.length > 0" class="space-y-4">
        <div
          v-for="acc in accounts"
          :key="acc._id"
          class="border p-4 rounded flex justify-between items-center bg-gray-50 hover:bg-gray-100"
        >
          <div>
            <p><strong>Name:</strong> {{ acc.accname }}</p>
            <p><strong>Number:</strong> {{ acc.accnumber }}</p>
            <p><strong>Type:</strong> {{ acc.acctype }}</p>
            <p><strong>Value:</strong> {{ acc.accvalue.toFixed(2) }} {{ acc.acccurrency }}</p>
            <p><strong>Recurring:</strong> {{ acc.isRecurring ? 'Yes' : 'No' }}</p>
            <p v-if="acc.isRecurring"><strong>Pattern:</strong> {{ acc.recurrencePattern }}</p>
            <p v-if="acc.isRecurring"><strong>End Date:</strong> {{ formatDate(acc.endDate) }}</p>
          </div>
          <div class="flex space-x-2">
            <button
              @click="editAccount(acc)"
              class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              @click="deleteAccount(acc._id)"
              class="bg-red-500 text-white p-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <p v-else class="text-gray-500">No accounts found.</p>
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
      account: {
        accname: '',
        accnumber: null,
        acctype: '',
        accvalue: null,
        acccurrency: '',
        isRecurring: false,
        recurrencePattern: '',
        endDate: ''
      },
      accounts: [],
      isEditing: false,
      editingAccountId: null,
      loading: false
    }
  },
  async mounted() {
    await this.fetchAccounts()
  },
  methods: {
    async addAccount() {
      const toast = useToast()
      try {
        this.loading = true
        const authStore = useAuthStore()
        if (!authStore.token) {
          toast.error('Please log in to add an account')
          this.$router.push('/login')
          return
        }

        const payload = {
          accname: this.account.accname,
          accnumber: Number(this.account.accnumber),
          acctype: this.account.acctype,
          accvalue: Number(this.account.accvalue),
          acccurrency: this.account.acccurrency,
          isRecurring: this.account.isRecurring
        }
        if (this.account.isRecurring) {
          payload.recurrencePattern = this.account.recurrencePattern
          payload.endDate = this.account.endDate
        }

        const response = await axios.post(
          'http://localhost:8000/Addaccount/addacc',
          payload,
          {
            headers: { Authorization: `Bearer ${authStore.token}` }
          }
        )

        toast.success('Account added successfully')
        await this.fetchAccounts()
        this.resetForm()
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to add account')
      } finally {
        this.loading = false
      }
    },
    async updateAccount() {
      const toast = useToast()
      try {
        this.loading = true
        const authStore = useAuthStore()
        if (!authStore.token) {
          toast.error('Please log in to update an account')
          this.$router.push('/login')
          return
        }

        const payload = {
          accname: this.account.accname,
          accnumber: Number(this.account.accnumber),
          acctype: this.account.acctype,
          accvalue: Number(this.account.accvalue),
          acccurrency: this.account.acccurrency,
          isRecurring: this.account.isRecurring
        }
        if (this.account.isRecurring) {
          payload.recurrencePattern = this.account.recurrencePattern
          payload.endDate = this.account.endDate
        }

        const response = await axios.put(
          `http://localhost:8000/Addaccount/update/${this.editingAccountId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${authStore.token}` }
          }
        )

        toast.success('Account updated successfully')
        await this.fetchAccounts()
        this.resetForm()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to update account')
      } finally {
        this.loading = false
      }
    },
    async fetchAccounts() {
      const toast = useToast()
      this.loading = true
      try {
        const authStore = useAuthStore()
        if (!authStore.token) {
          toast.error('Please log in to view accounts')
          this.$router.push('/login')
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
      } finally {
        this.loading = false
      }
    },
    async deleteAccount(accountId) {
      const toast = useToast()
      if (!confirm('Are you sure you want to delete this account?')) return

      try {
        this.loading = true
        const authStore = useAuthStore()
        if (!authStore.token) {
          toast.error('Please log in to delete an account')
          this.$router.push('/login')
          return
        }

        await axios.delete(
          `http://localhost:8000/Addaccount/delete/${accountId}`,
          {
            headers: { Authorization: `Bearer ${authStore.token}` }
          }
        )

        toast.success('Account deleted successfully')
        await this.fetchAccounts()
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to delete account')
      } finally {
        this.loading = false
      }
    },
    editAccount(acc) {
      this.isEditing = true
      this.editingAccountId = acc._id
      this.account = {
        accname: acc.accname,
        accnumber: acc.accnumber,
        acctype: acc.acctype,
        accvalue: acc.accvalue,
        acccurrency: acc.acccurrency,
        isRecurring: acc.isRecurring,
        recurrencePattern: acc.recurrencePattern || '',
        endDate: acc.endDate ? acc.endDate.split('T')[0] : ''
      }
    },
    resetForm() {
      this.account = {
        accname: '',
        accnumber: null,
        acctype: '',
        accvalue: null,
        acccurrency: '',
        isRecurring: false,
        recurrencePattern: '',
        endDate: ''
      }
      this.isEditing = false
      this.editingAccountId = null
    },
    cancelAction() {
      this.resetForm()
    },
    formatDate(date) {
      if (!date) return ''
      return new Date(date).toLocaleDateString()
    }
  }
}
</script>