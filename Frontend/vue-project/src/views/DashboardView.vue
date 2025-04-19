<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h2>User Dashboard</h2>
      <div class="header-divider"></div>
    </div>

    <!-- Profile Section -->
    <div v-if="user" class="profile-card card">
      <div class="profile-header">
        <h3>Profile Information</h3>
        <div class="profile-actions">
          <button @click="showUpdateForm = true" class="action-btn update-btn">
            <svg class="btn-icon" viewBox="0 0 24 24">
              <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
            </svg>
            Update Profile
          </button>
          <button @click="deleteAccount" class="action-btn delete-btn">
            <svg class="btn-icon" viewBox="0 0 24 24">
              <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
            </svg>
            Delete Account
          </button>
        </div>
      </div>
      <div class="profile-details">
        <div class="detail-item">
          <span class="detail-label">Name:</span>
          <span class="detail-value">{{ user.name }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Email:</span>
          <span class="detail-value">{{ user.email }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Role:</span>
          <span class="detail-value role-badge">{{ user.role }}</span>
        </div>
      </div>
      <div class="quick-actions">
        <button @click="$router.push('/add-account')" class="quick-action-btn account-btn">
          <svg class="action-icon" viewBox="0 0 24 24">
            <path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
          </svg>
          Add Account
        </button>
        <button @click="$router.push('/add-budget')" class="quick-action-btn budget-btn">
          <svg class="action-icon" viewBox="0 0 24 24">
            <path d="M5,6H23V18H5V6M14,9A3,3 0 0,1 17,12A3,3 0 0,1 14,15A3,3 0 0,1 11,12A3,3 0 0,1 14,9M9,8A2,2 0 0,1 7,10V14A2,2 0 0,1 9,16H19A2,2 0 0,1 21,14V10A2,2 0 0,1 19,8H9M1,10H3V20H19V22H1V10Z" />
          </svg>
          Add Budget
        </button>
        <button @click="$router.push('/add-transaction')" class="quick-action-btn transaction-btn">
          <svg class="action-icon" viewBox="0 0 24 24">
            <path d="M20,20A2,2 0 0,1 18,22H4A2,2 0 0,1 2,20V6A2,2 0 0,1 4,4H9.5C9.2,4.8 9,5.6 9,6.5C9,10.1 11.9,13 15.5,13C16.3,13 17,12.9 17.6,12.6L20,15V20M19.3,8.9C19.7,8.2 20,7.4 20,6.5C20,4 18,2 15.5,2C13,2 11,4 11,6.5C11,9 13,11 15.5,11C16.4,11 17.2,10.7 17.9,10.3L21,13.4L22.4,12L19.3,8.9M15.5,7C16.3,7 17,6.3 17,5.5C17,4.7 16.3,4 15.5,4C14.7,4 14,4.7 14,5.5C14,6.3 14.7,7 15.5,7Z" />
          </svg>
          Add Transaction
        </button>
        <button @click="$router.push('/add-goal')" class="quick-action-btn goal-btn">
          <svg class="action-icon" viewBox="0 0 24 24">
            <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z" />
          </svg>
          Add Goal
        </button>
        <button @click="$router.push('/reports')" class="quick-action-btn reports-btn">
          <svg class="action-icon" viewBox="0 0 24 24">
            <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M7,20H9V14H7V20M11,20H13V12H11V20M15,20H17V16H15V20Z" />
          </svg>
          Reports
        </button>
      </div>
    </div>

    <!-- Rest of the template remains the same -->
    <!-- Update Profile Form -->
    <transition name="slide-fade">
      <div v-if="showUpdateForm" class="update-form-card card">
        <div class="form-header">
          <h3>Update Profile</h3>
          <button @click="showUpdateForm = false" class="close-btn">
            <svg viewBox="0 0 24 24">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="updateProfile" class="profile-form">
          <div class="form-group">
            <label>Name</label>
            <input v-model="updateForm.name" type="text" class="form-input" required />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="updateForm.email" type="email" class="form-input" required />
          </div>
          <div class="form-actions">
            <button type="submit" class="submit-btn">
              Save Changes
              <svg class="submit-icon" viewBox="0 0 24 24">
                <path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </transition>

    <!-- Account List -->
    <div class="accounts-section">
      <div class="section-header">
        <h3>Your Accounts</h3>
        <div class="header-divider"></div>
      </div>
      <div v-if="details.accounts.length === 0" class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24">
          <path d="M12,13A5,5 0 0,1 7,8H9A3,3 0 0,0 12,11A3,3 0 0,0 15,8H17A5,5 0 0,1 12,13M12,3A3,3 0 0,1 15,6H9A3,3 0 0,1 12,3M19,6H17A5,5 0 0,0 12,1A5,5 0 0,0 7,6H5C3.89,6 3,6.89 3,8V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V8C21,6.89 20.1,6 19,6Z" />
        </svg>
        <p>No accounts found</p>
        <button @click="$router.push('/add-account')" class="add-account-btn">
          Add Your First Account
        </button>
      </div>
      <div v-else class="accounts-grid">
        <div v-for="account in details.accounts" :key="account._id" class="account-card">
          <div class="account-header">
            <h4>{{ account.accname }}</h4>
            <span class="account-type">{{ account.acctype }}</span>
          </div>
          <div class="account-details">
            <div class="detail-row">
              <span class="detail-label">Account Number:</span>
              <span class="detail-value">{{ account.accnumber }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Current Value:</span>
              <span class="detail-value amount">{{ account.accvalue }} LKR</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">End Date:</span>
              <span class="detail-value">{{ formatDate(account.endDate) }}</span>
            </div>
          </div>
          <div class="account-actions">
            <button class="action-btn view-btn">
              <svg viewBox="0 0 24 24">
                <path d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z" />
              </svg>
              View
            </button>
            <button class="action-btn edit-btn">
              <svg viewBox="0 0 24 24">
                <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
              </svg>
              Edit
            </button>
          </div>
        </div>
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
      user: null,
      details: { accounts: [] },
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
      await this.fetchAccounts()
      this.updateForm = { name: this.user.name, email: this.user.email }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load dashboard')
      this.$router.push('/login')
    }
  },
  methods: {
    async fetchAccounts() {
      const toast = useToast()
      try {
        const authStore = useAuthStore()
        const response = await axios.get('http://localhost:8000/Addaccount/showacc', {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })
        this.details.accounts = response.data || []
        if (this.details.accounts.length === 0) {
          toast.warning('No accounts found. Please add an account.')
        }
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to fetch accounts')
        this.details.accounts = []
      }
    },
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
    },
    formatDate(date) {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).split('/').join('/')
    }
  }
}
</script>

<style>
/* Add this new style for the reports button hover effect */
.reports-btn:hover {
  background-color: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

/* Rest of the styles remain the same */
:root {
  --primary-color: #4f46e5;
  --primary-hover: #4338ca;
  --success-color: #10b981;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  --info-color: #3b82f6;
  --text-color: #374151;
  --text-light: #6b7280;
  --bg-color: #f9fafb;
  --card-bg: #ffffff;
  --border-color: #e5e7eb;
  --shadow-color: rgba(0, 0, 0, 0.1);
  --transition-speed: 0.3s;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  line-height: 1.6;
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem;
}

.dashboard-header {
  margin-bottom: 3rem;
  text-align: center;
  position: relative;
}

.dashboard-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
}

.dashboard-header h2::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 5px;
  background: linear-gradient(90deg, var(--primary-color), var(--info-color));
  border-radius: 3px;
}

.header-divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--border-color), transparent);
  margin: 2rem 0;
}

.card {
  background-color: var(--card-bg);
  border-radius: 1.25rem;
  box-shadow: 0 15px 25px -5px var(--shadow-color);
  padding: 2.5rem;
  margin-bottom: 3rem;
  transition: transform var(--transition-speed) ease, box-shadow var(--transition-speed) ease;
}

.card:hover {
  transform: translateY(-7px);
  box-shadow: 0 25px 35px -10px rgba(0, 0, 0, 0.15);
}

.profile-card {
  position: relative;
  overflow: hidden;
}

.profile-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 10px;
  background: linear-gradient(90deg, var(--primary-color), var(--info-color));
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.profile-header h3 {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-color);
}

.profile-actions {
  display: flex;
  gap: 1.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: 0.85rem;
  font-weight: 500;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  border: none;
}

.btn-icon {
  width: 1.5rem;
  height: 1.5rem;
  fill: currentColor;
}

.update-btn {
  background-color: var(--primary-color);
  color: white;
}

.update-btn:hover {
  background-color: var(--primary-hover);
  transform: translateY(-3px);
}

.delete-btn {
  background-color: var(--danger-color);
  color: white;
}

.delete-btn:hover {
  background-color: #dc2626;
  transform: translateY(-3px);
}

.profile-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.detail-item {
  background-color: var(--bg-color);
  padding: 1.75rem;
  border-radius: 1rem;
  transition: transform var(--transition-speed) ease;
}

.detail-item:hover {
  transform: translateY(-5px);
}

.detail-label {
  display: block;
  font-size: 1rem;
  color: var(--text-light);
  margin-bottom: 0.75rem;
}

.detail-value {
  font-size: 1.25rem;
  font-weight: 500;
}

.role-badge {
  display: inline-block;
  padding: 0.35rem 1rem;
  border-radius: 9999px;
  background-color: var(--primary-color);
  color: white;
  font-size: 1rem;
  text-transform: capitalize;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.quick-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  border-radius: 1rem;
  background-color: var(--bg-color);
  color: var(--text-color);
  font-weight: 500;
  font-size: 1.1rem;
  transition: all var(--transition-speed) ease;
  border: none;
  cursor: pointer;
}

.quick-action-btn:hover {
  transform: translateY(-7px);
  box-shadow: 0 15px 25px -5px rgba(0, 0, 0, 0.1);
}

.action-icon {
  width: 2.5rem;
  height: 2.5rem;
  margin-bottom: 1rem;
  fill: currentColor;
}

.account-btn:hover {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
}

.budget-btn:hover {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--info-color);
}

.transaction-btn:hover {
  background-color: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.goal-btn:hover {
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--warning-color);
}

/* Update Form Styles */
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.update-form-card {
  position: relative;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.form-header h3 {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-color);
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 50%;
  transition: background-color var(--transition-speed) ease;
}

.close-btn:hover {
  background-color: var(--bg-color);
}

.close-btn svg {
  width: 1.75rem;
  height: 1.75rem;
  fill: var(--text-light);
}

.profile-form {
  display: grid;
  gap: 2rem;
}

.form-group {
  position: relative;
}

.form-group label {
  display: block;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-light);
  margin-bottom: 0.75rem;
}

.form-input {
  width: 100%;
  padding: 1.25rem;
  font-size: 1.1rem;
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  background-color: var(--bg-color);
  transition: all var(--transition-speed) ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.2);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.submit-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 2rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 1rem;
  font-weight: 500;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
}

.submit-btn:hover {
  background-color: var(--primary-hover);
  transform: translateY(-3px);
}

.submit-icon {
  width: 1.5rem;
  height: 1.5rem;
  fill: currentColor;
}

/* Accounts Section */
.accounts-section {
  margin-top: 4rem;
}

.section-header {
  margin-bottom: 2.5rem;
}

.section-header h3 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-color);
  position: relative;
  display: inline-block;
}

.section-header h3::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--info-color));
  border-radius: 3px;
}

.empty-state {
  text-align: center;
  padding: 4rem 3rem;
  background-color: var(--bg-color);
  border-radius: 1.25rem;
  border: 2px dashed var(--border-color);
}

.empty-icon {
  width: 5rem;
  height: 5rem;
  fill: var(--text-light);
  margin-bottom: 2rem;
  opacity: 0.7;
}

.empty-state p {
  color: var(--text-light);
  margin-bottom: 2rem;
  font-size: 1.25rem;
}

.add-account-btn {
  padding: 1.25rem 2rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 1rem;
  font-weight: 500;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
}

.add-account-btn:hover {
  background-color: var(--primary-hover);
  transform: translateY(-3px);
}

.accounts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.account-card {
  background-color: var(--card-bg);
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all var(--transition-speed) ease;
  border: 1px solid var(--border-color);
}

.account-card:hover {
  transform: translateY(-7px);
  box-shadow: 0 25px 35px -10px rgba(0, 0, 0, 0.15);
}

.account-header {
  padding: 2rem;
  background-color: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.account-header h4 {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--text-color);
}

.account-type {
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.35rem 1rem;
  border-radius: 9999px;
  background-color: var(--primary-color);
  color: white;
  text-transform: uppercase;
}

.account-details {
  padding: 2rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-size: 1rem;
  color: var(--text-light);
}

.detail-value {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-color);
}

.detail-value.amount {
  font-weight: 600;
  color: var(--success-color);
  font-size: 1.1rem;
}

.account-actions {
  display: flex;
  border-top: 1px solid var(--border-color);
  padding: 1.5rem;
}

.account-actions button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.05rem;
  transition: all var(--transition-speed) ease;
}

.account-actions button svg {
  width: 1.25rem;
  height: 1.25rem;
  fill: currentColor;
}

.account-actions button:first-child {
  border-right: 1px solid var(--border-color);
}

.view-btn {
  color: var(--info-color);
}

.view-btn:hover {
  background-color: rgba(59, 130, 246, 0.1);
}

.edit-btn {
  color: var(--warning-color);
}

.edit-btn:hover {
  background-color: rgba(245, 158, 11, 0.1);
}

@media (max-width: 1024px) {
  .dashboard-container {
    padding: 2.5rem;
  }
  
  .quick-actions {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .accounts-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 2rem;
  }
  
  .profile-actions {
    flex-direction: column;
    width: 100%;
    gap: 1rem;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
  
  .quick-actions {
    grid-template-columns: 1fr 1fr;
  }
  
  .accounts-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-header h2 {
    font-size: 2.25rem;
  }
  
  .section-header h3 {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .dashboard-container {
    padding: 1.5rem;
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
  }
  
  .profile-details {
    grid-template-columns: 1fr;
  }
  
  .dashboard-header h2 {
    font-size: 2rem;
  }
  
  .section-header h3 {
    font-size: 1.5rem;
  }
  
  .card {
    padding: 2rem 1.5rem;
  }
}
</style>