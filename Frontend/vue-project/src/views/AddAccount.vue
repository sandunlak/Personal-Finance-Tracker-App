<template>
  <div class="accounts-container">
    <div class="account-form-section">
      <h2 class="section-title">{{ isEditing ? 'Update Account' : 'Add New Account' }}</h2>
      <div class="form-card">
        <form @submit.prevent="isEditing ? updateAccount() : addAccount()">
          <div class="form-group">
            <label class="form-label">Account Name</label>
            <input
              v-model="account.accname"
              type="text"
              required
              class="form-input"
              placeholder="Enter account name"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Account Number</label>
            <input
              v-model="account.accnumber"
              type="number"
              required
              class="form-input"
              placeholder="Enter account number"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Account Type</label>
            <select
              v-model="account.acctype"
              required
              class="form-input"
            >
              <option value="" disabled>Select account type</option>
              <option value="Checking">Checking</option>
              <option value="Savings">Savings</option>
              <option value="Credit">Credit</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Account Value</label>
            <input
              v-model="account.accvalue"
              type="number"
              step="0.01"
              required
              class="form-input"
              placeholder="Enter account value"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Currency</label>
            <select
              v-model="account.acccurrency"
              required
              class="form-input"
            >
              <option value="" disabled>Select currency</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="LKR">LKR</option>
            </select>
          </div>
          <div class="form-group checkbox-group">
            <input
              v-model="account.isRecurring"
              type="checkbox"
              id="recurringCheckbox"
              class="checkbox-input"
            />
            <label for="recurringCheckbox" class="checkbox-label">Enable recurring transaction</label>
          </div>
          <div v-if="account.isRecurring" class="form-group">
            <label class="form-label">Recurrence Pattern</label>
            <select
              v-model="account.recurrencePattern"
              required
              class="form-input"
            >
              <option value="" disabled>Select recurrence pattern</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div v-if="account.isRecurring" class="form-group">
            <label class="form-label">End Date</label>
            <input
              v-model="account.endDate"
              type="date"
              required
              class="form-input"
            />
          </div>
          <div class="form-actions">
            <button
              type="submit"
              class="btn btn-primary"
            >
              {{ isEditing ? 'Update Account' : 'Add Account' }}
            </button>
            <button
              @click="cancelAction"
              type="button"
              class="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Display All Accounts -->
    <div class="accounts-list-section">
      <h3 class="section-title">Your Accounts</h3>
      <div v-if="loading" class="loading-message">
        <div class="spinner"></div>
        <span>Loading accounts...</span>
      </div>
      <div v-else-if="accounts.length > 0" class="accounts-grid">
        <div
          v-for="acc in accounts"
          :key="acc._id"
          class="account-card"
        >
          <div class="account-details">
            <p><span class="detail-label">Name:</span> {{ acc.accname }}</p>
            <p><span class="detail-label">Number:</span> {{ acc.accnumber }}</p>
            <p><span class="detail-label">Type:</span> {{ acc.acctype }}</p>
            <p><span class="detail-label">Value:</span> {{ acc.accvalue.toFixed(2) }} {{ acc.acccurrency }}</p>
            <p><span class="detail-label">Recurring:</span> {{ acc.isRecurring ? 'Yes' : 'No' }}</p>
            <p v-if="acc.isRecurring"><span class="detail-label">Pattern:</span> {{ acc.recurrencePattern }}</p>
            <p v-if="acc.isRecurring"><span class="detail-label">End Date:</span> {{ formatDate(acc.endDate) }}</p>
          </div>
          <div class="account-actions">
            <button
              @click="editAccount(acc)"
              class="btn btn-edit"
            >
              Edit
            </button>
            <button
              @click="deleteAccount(acc._id)"
              class="btn btn-delete"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <p v-else class="empty-message">No accounts found.</p>
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

<style scoped>
/* Base Styles */
.accounts-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  position: relative;
  padding-bottom: 0.5rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #3498db, #2ecc71);
}

/* Form Styles */
.account-form-section {
  margin-bottom: 3rem;
}

.form-card {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.form-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-input:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  outline: none;
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  margin-right: 0.75rem;
  accent-color: #3498db;
  cursor: pointer;
}

.checkbox-label {
  font-weight: 500;
  color: #555;
  cursor: pointer;
}

/* Button Styles */
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(135deg, #3498db, #2ecc71);
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2980b9, #27ae60);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(41, 128, 185, 0.3);
}

.btn-secondary {
  background: #f1f1f1;
  color: #555;
}

.btn-secondary:hover {
  background: #e0e0e0;
  transform: translateY(-1px);
}

.btn-edit {
  background: #3498db;
  color: white;
}

.btn-edit:hover {
  background: #2980b9;
  transform: translateY(-1px);
}

.btn-delete {
  background: #e74c3c;
  color: white;
}

.btn-delete:hover {
  background: #c0392b;
  transform: translateY(-1px);
}

/* Accounts List Styles */
.accounts-list-section {
  margin-top: 2rem;
}

.loading-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #7f8c8d;
  font-size: 1.1rem;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(52, 152, 219, 0.2);
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.accounts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.account-card {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.account-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.account-details {
  margin-bottom: 1.5rem;
}

.account-details p {
  margin: 0.5rem 0;
  line-height: 1.5;
}

.detail-label {
  font-weight: 500;
  color: #555;
  display: inline-block;
  min-width: 100px;
}

.account-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.empty-message {
  text-align: center;
  color: #7f8c8d;
  font-size: 1.1rem;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .accounts-container {
    padding: 1rem;
  }
  
  .accounts-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>