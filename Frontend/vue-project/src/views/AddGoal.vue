<template>
  <div style="max-width: 1200px; margin: 0 auto; padding: 24px;">
    <!-- Add New Goal Form -->
    <h2 style="font-size: 30px; font-weight: bold; margin-bottom: 24px; color: #1f2937;">Add New Goal</h2>
    <div style="background-color: #ffffff; box-shadow: 0 10px 20px rgba(0,0,0,0.1); border-radius: 16px; padding: 32px; margin-bottom: 40px;">
      <form @submit.prevent="addGoal">
        <div style="margin-bottom: 24px;">
          <label style="display: block; font-size: 18px; font-weight: 500; color: #374151; margin-bottom: 8px;">Goal Name</label>
          <input 
            v-model="goalForm.goalName" 
            type="text" 
            required
            style="width: 100%; padding: 16px; border: 1px solid #d1d5db; border-radius: 12px; font-size: 18px; transition: all 0.3s ease;"
            placeholder="e.g., Save for Vacation"
          />
        </div>
        <div style="margin-bottom: 24px;">
          <label style="display: block; font-size: 18px; font-weight: 500; color: #374151; margin-bottom: 8px;">Target Amount (LKR)</label>
          <input 
            v-model.number="goalForm.targetAmount" 
            type="number" 
            required
            min="0"
            step="0.01"
            style="width: 100%; padding: 16px; border: 1px solid #d1d5db; border-radius: 12px; font-size: 18px; transition: all 0.3s ease;"
          />
        </div>
        <div style="margin-bottom: 24px;">
          <label style="display: block; font-size: 18px; font-weight: 500; color: #374151; margin-bottom: 8px;">Deadline</label>
          <input 
            v-model="goalForm.deadline" 
            type="date" 
            required
            style="width: 100%; padding: 16px; border: 1px solid #d1d5db; border-radius: 12px; font-size: 18px; transition: all 0.3s ease;"
          />
        </div>
        <div style="margin-bottom: 24px;">
          <label style="display: block; font-size: 18px; font-weight: 500; color: #374151; margin-bottom: 8px;">Description</label>
          <textarea 
            v-model="goalForm.description" 
            style="width: 100%; padding: 16px; border: 1px solid #d1d5db; border-radius: 12px; font-size: 18px; min-height: 120px; transition: all 0.3s ease;"
            placeholder="Optional description of your goal"
          ></textarea>
        </div>
        <div style="display: flex; gap: 16px;">
          <button 
            type="submit" 
            style="background-color: #4f46e5; color: #ffffff; padding: 16px; border-radius: 12px; font-size: 18px; font-weight: 600; transition: all 0.3s ease;"
            :disabled="isAddingGoal"
          >
            {{ isAddingGoal ? 'Adding...' : 'Add Goal' }}
          </button>
          <button 
            type="button" 
            @click="$router.push('/dashboard')" 
            style="background-color: #6b7280; color: #ffffff; padding: 16px; border-radius: 12px; font-size: 18px; font-weight: 600; transition: all 0.3s ease;"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Display All Goals -->
    <h2 style="font-size: 30px; font-weight: bold; margin-bottom: 24px; color: #1f2937;">Your Goals</h2>
    
    <div v-if="goals.length === 0" style="background-color: #ffffff; box-shadow: 0 10px 20px rgba(0,0,0,0.1); border-radius: 16px; padding: 32px; margin-bottom: 40px; text-align: center;">
      <p style="font-size: 20px; color: #6b7280;">No goals added yet. Create your first goal above!</p>
    </div>

    <div v-else style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 40px;">
      <div 
        v-for="goal in goals" 
        :key="goal._id" 
        style="background-color: #ffffff; box-shadow: 0 10px 20px rgba(0,0,0,0.1); border-radius: 16px; padding: 32px; transition: all 0.3s ease;"
        :style="calculateProgress(goal) >= 100 ? 'border-left: 8px solid #22c55e;' : ''"
      >
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
          <h3 style="font-size: 24px; font-weight: bold; color: #1f2937;">{{ goal.goalName }}</h3>
          <span 
            style="padding: 8px 16px; font-size: 14px; border-radius: 9999px; font-weight: 500;"
            :style="calculateProgress(goal) >= 100 ? 'background-color: #dcfce7; color: #166534;' : 'background-color: #e0e7ff; color: #4f46e5;'"
          >
            {{ calculateProgress(goal) >= 100 ? 'Completed' : 'In Progress' }}
          </span>
        </div>
        
        <p style="font-size: 18px; color: #6b7280; margin-bottom: 16px;">{{ goal.description }}</p>
        
        <div style="margin-bottom: 16px; font-size: 18px;">
          <p><strong>Target:</strong> LKR {{ goal.targetAmount.toLocaleString() }}</p>
          <p><strong>Saved:</strong> LKR {{ (goal.currentAmount || 0).toLocaleString() }}</p>
          <p><strong>Deadline:</strong> {{ formatDate(goal.deadline) }}</p>
        </div>
        
        <div style="width: 100%; background-color: #e5e7eb; border-radius: 9999px; height: 16px; margin-bottom: 16px;">
          <div 
            style="background-color: #4f46e5; height: 16px; border-radius: 9999px; transition: width 0.3s ease;"
            :style="`width: ${Math.min(calculateProgress(goal), 100)}%`"
          ></div>
        </div>
        
        <p style="font-size: 18px; text-align: right; margin-bottom: 16px;">
          {{ calculateProgress(goal) }}% completed
          <span v-if="calculateProgress(goal) >= 100" style="color: #22c55e; font-size: 24px;">🎉</span>
        </p>
        
        <div style="display: flex; gap: 16px;">
          <button 
            @click="toggleTransactionForm(goal._id)"
            style="background-color: #4f46e5; color: #ffffff; padding: 8px 16px; border-radius: 12px; font-size: 18px; font-weight: 600; transition: all 0.3s ease;"
            :disabled="isSubmitting"
          >
            Add Transaction
          </button>
          <button 
            @click="deleteGoal(goal._id)"
            style="background-color: #ef4444; color: #ffffff; padding: 8px 16px; border-radius: 12px; font-size: 18px; font-weight: 600; transition: all 0.3s ease;"
            :disabled="isDeleting"
          >
            Delete
          </button>
        </div>
        
        <!-- Transaction Form for this Goal -->
        <div v-if="activeTransactionForm === goal._id" style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
          <h4 style="font-size: 20px; font-weight: 500; color: #1f2937; margin-bottom: 16px;">Add Transaction</h4>
          <form @submit.prevent="addTransaction(goal._id)">
            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 18px; font-weight: 500; color: #374151; margin-bottom: 8px;">Type</label>
              <select 
                v-model="transactionForm.transtype" 
                required
                style="width: 100%; padding: 16px; font-size: 18px; border: 1px solid #d1d5db; border-radius: 12px; transition: all 0.3s ease;"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 18px; font-weight: 500; color: #374151; margin-bottom: 8px;">Amount (LKR)</label>
              <input 
                v-model.number="transactionForm.value" 
                type="number" 
                required
                min="0.01"
                step="0.01"
                style="width: 100%; padding: 16px; font-size: 18px; border: 1px solid #d1d5db; border-radius: 12px; transition: all 0.3s ease;"
              />
            </div>
            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 18px; font-weight: 500; color: #374151; margin-bottom: 8px;">Account</label>
              <select 
                v-model="transactionForm.accountId" 
                required
                style="width: 100%; padding: 16px; font-size: 18px; border: 1px solid #d1d5db; border-radius: 12px; transition: all 0.3s ease;"
              >
                <option value="">Select an account</option>
                <option 
                  v-for="account in userAccounts" 
                  :key="account._id" 
                  :value="account._id"
                >
                  {{ account.accountName }} ({{ account.accountType }}) - LKR {{ account.accvalue }}
                </option>
              </select>
            </div>
            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 18px; font-weight: 500; color: #374151; margin-bottom: 8px;">Category</label>
              <select 
                v-model="transactionForm.category" 
                required
                style="width: 100%; padding: 16px; font-size: 18px; border: 1px solid #d1d5db; border-radius: 12px; transition: all 0.3s ease;"
              >
                <option value="">Select a category</option>
                <option value="food">Food</option>
                <option value="transportation">Transportation</option>
                <option value="entertainment">Entertainment</option>
                <option value="others">Others</option>
              </select>
            </div>
            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 18px; font-weight: 500; color: #374151; margin-bottom: 8px;">Description</label>
              <textarea 
                v-model="transactionForm.description" 
                style="width: 100%; padding: 16px; font-size: 18px; border: 1px solid #d1d5db; border-radius: 12px; min-height: 80px; transition: all 0.3s ease;"
                placeholder="Optional description"
              ></textarea>
            </div>
            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 18px; font-weight: 500; color: #374151; margin-bottom: 8px;">Date</label>
              <input 
                v-model="transactionForm.date" 
                type="date" 
                required
                style="width: 100%; padding: 16px; font-size: 18px; border: 1px solid #d1d5db; border-radius: 12px; transition: all 0.3s ease;"
              />
            </div>
            <div style="display: flex; gap: 16px;">
              <button 
                type="submit" 
                style="background-color: #22c55e; color: #ffffff; padding: 8px 16px; border-radius: 12px; font-size: 18px; font-weight: 600; transition: all 0.3s ease;"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Processing...' : 'Save' }}
              </button>
              <button 
                type="button" 
                @click="cancelTransactionForm"
                style="background-color: #6b7280; color: #ffffff; padding: 8px 16px; border-radius: 12px; font-size: 18px; font-weight: 600; transition: all 0.3s ease;"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import { useToast } from 'vue-toastification'

export default {
  data() {
    return {
      goalForm: {
        goalName: '',
        targetAmount: 0,
        deadline: '',
        description: ''
      },
      transactionForm: {
        value: 0,
        transtype: 'income',
        category: 'others',
        description: '',
        accountId: '',
        date: new Date().toISOString().split('T')[0],
        goalId: ''
      },
      goals: [],
      userAccounts: [],
      activeTransactionForm: null,
      isSubmitting: false,
      isAddingGoal: false,
      isDeleting: false
    }
  },
  methods: {
    async fetchGoals() {
      const toast = useToast()
      try {
        const authStore = useAuthStore()
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/goals/getgoals`,
          {
            headers: { Authorization: `Bearer ${authStore.token}` }
          }
        )
        this.goals = response.data
      } catch (error) {
        toast.error('Failed to fetch goals')
        console.error('Error fetching goals:', error)
      }
    },
    
    async fetchUserAccounts() {
      const toast = useToast()
      try {
        const authStore = useAuthStore()
        const response = await axios.get(
          'http://localhost:8000/Addaccount/showacc',
          {
            headers: { 
              Authorization: `Bearer ${authStore.token}`,
              'Content-Type': 'application/json'
            }
          }
        )
        this.userAccounts = response.data
        
        if (this.userAccounts.length > 0 && !this.transactionForm.accountId) {
          this.transactionForm.accountId = this.userAccounts[0]._id
        }
      } catch (error) {
        toast.error('Failed to fetch accounts')
        console.error('Error fetching accounts:', error)
      }
    },

    async addGoal() {
      const toast = useToast()
      this.isAddingGoal = true
      try {
        const authStore = useAuthStore()
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/goals/goals`,
          this.goalForm,
          {
            headers: { Authorization: `Bearer ${authStore.token}` }
          }
        )
        this.goals.push(response.data.goal)
        this.goalForm = {
          goalName: '',
          targetAmount: 0,
          deadline: '',
          description: ''
        }
        toast.success('Goal added successfully')
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to add goal')
      } finally {
        this.isAddingGoal = false
      }
    },

    async deleteGoal(goalId) {
      const toast = useToast()
      this.isDeleting = true
      try {
        const authStore = useAuthStore()
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/goals/goals/${goalId}`,
          {
            headers: { Authorization: `Bearer ${authStore.token}` }
          }
        )
        this.goals = this.goals.filter(goal => goal._id !== goalId)
        toast.success('Goal deleted successfully')
      } catch (error) {
        toast.error('Failed to delete goal')
      } finally {
        this.isDeleting = false
      }
    },

    toggleTransactionForm(goalId) {
      this.activeTransactionForm = this.activeTransactionForm === goalId ? null : goalId
      this.transactionForm.goalId = goalId
    },

    cancelTransactionForm() {
      this.activeTransactionForm = null
      this.resetTransactionForm()
    },

    resetTransactionForm() {
      this.transactionForm = {
        value: 0,
        transtype: 'income',
        category: 'others',
        description: '',
        accountId: this.userAccounts.length > 0 ? this.userAccounts[0]._id : '',
        date: new Date().toISOString().split('T')[0],
        goalId: this.activeTransactionForm || ''
      }
    },

    async addTransaction(goalId) {
      const toast = useToast()
      this.isSubmitting = true
      
      try {
        const authStore = useAuthStore()
        
        // Validate form
        if (!this.transactionForm.accountId) {
          toast.error('Please select an account')
          return
        }

        if (this.transactionForm.value <= 0) {
          toast.error('Amount must be greater than 0')
          return
        }

        if (!this.transactionForm.category) {
          toast.error('Please select a category')
          return
        }

        if (this.transactionForm.transtype === 'income' && !goalId) {
          toast.error('Goal ID is required for income transactions')
          return
        }

        // Prepare transaction data
        const transactionData = {
          value: parseFloat(this.transactionForm.value),
          transtype: this.transactionForm.transtype,
          category: this.transactionForm.category,
          description: this.transactionForm.description || '',
          accountId: this.transactionForm.accountId,
          tags: ['others'],
          date: new Date(this.transactionForm.date).toISOString(),
          goalId: goalId
        }

        // Make API call
        await axios.post(
          'http://localhost:8000/api/goals/addtran',
          transactionData,
          {
            headers: { 
              Authorization: `Bearer ${authStore.token}`,
              'Content-Type': 'application/json'
            }
          }
        )

        toast.success('Transaction added successfully')
        this.activeTransactionForm = null
        this.resetTransactionForm()
        
        await Promise.all([
          this.fetchGoals(),
          this.fetchUserAccounts()
        ])
        
      } catch (error) {
        console.error('Transaction error:', error.response?.data || error.message)
        const errorMessage = error.response?.data?.error || 
                           error.response?.data?.message || 
                           'Failed to add transaction'
        toast.error(errorMessage)
      } finally {
        this.isSubmitting = false
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },

    calculateProgress(goal) {
      return goal.targetAmount > 0 
        ? ((goal.currentAmount || 0) / goal.targetAmount * 100).toFixed(2) 
        : 0
    }
  },

  async mounted() {
    await Promise.all([
      this.fetchGoals(),
      this.fetchUserAccounts()
    ])
  }
}
</script>

<style scoped>
/* Custom styles for inputs and buttons */
input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}

button:not(:disabled):hover {
  opacity: 0.9;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>