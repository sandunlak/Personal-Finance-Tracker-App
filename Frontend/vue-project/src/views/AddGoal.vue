<template>
  <div class="container mx-auto p-4">
    <!-- Add New Goal Form -->
    <h2 class="text-2xl font-bold mb-4">Add New Goal</h2>
    <div class="bg-white shadow-md rounded p-4 mb-8">
      <form @submit.prevent="addGoal">
        <div class="mb-4">
          <label class="block text-sm font-medium">Goal Name</label>
          <input 
            v-model="goalForm.goalName" 
            type="text" 
            required
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
            placeholder="e.g., Save for Vacation"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Target Amount (LKR)</label>
          <input 
            v-model.number="goalForm.targetAmount" 
            type="number" 
            required
            min="0"
            step="0.01"
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Deadline</label>
          <input 
            v-model="goalForm.deadline" 
            type="date" 
            required
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Description</label>
          <textarea 
            v-model="goalForm.description" 
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
            rows="4"
            placeholder="Optional description of your goal"
          ></textarea>
        </div>
        <div class="flex space-x-2">
          <button 
            type="submit" 
            class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            :disabled="isAddingGoal"
          >
            {{ isAddingGoal ? 'Adding...' : 'Add Goal' }}
          </button>
          <button 
            type="button" 
            @click="$router.push('/dashboard')" 
            class="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Display All Goals -->
    <h2 class="text-2xl font-bold mb-4">Your Goals</h2>
    
    <div v-if="goals.length === 0" class="bg-white shadow-md rounded p-4 mb-8 text-center">
      <p>No goals added yet. Create your first goal above!</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <div 
        v-for="goal in goals" 
        :key="goal._id" 
        class="bg-white shadow-md rounded p-4"
        :class="{'border-l-4 border-green-500': calculateProgress(goal) >= 100}"
      >
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-lg font-bold">{{ goal.goalName }}</h3>
          <span 
            class="px-2 py-1 text-xs rounded-full"
            :class="calculateProgress(goal) >= 100 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'"
          >
            {{ calculateProgress(goal) >= 100 ? 'Completed' : 'In Progress' }}
          </span>
        </div>
        
        <p class="text-sm text-gray-600 mb-2">{{ goal.description }}</p>
        
        <div class="mb-2">
          <p><strong>Target:</strong> LKR {{ goal.targetAmount.toLocaleString() }}</p>
          <p><strong>Saved:</strong> LKR {{ (goal.currentAmount || 0).toLocaleString() }}</p>
          <p><strong>Deadline:</strong> {{ formatDate(goal.deadline) }}</p>
        </div>
        
        <div class="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div 
            class="bg-blue-600 h-2.5 rounded-full" 
            :style="`width: ${Math.min(calculateProgress(goal), 100)}%`"
          ></div>
        </div>
        
        <p class="text-sm text-right mb-4">
          {{ calculateProgress(goal) }}% completed
          <span v-if="calculateProgress(goal) >= 100" class="text-green-500">🎉</span>
        </p>
        
        <div class="flex space-x-2">
          <button 
            @click="toggleTransactionForm(goal._id)"
            class="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            :disabled="isSubmitting"
          >
            Add Transaction
          </button>
          <button 
            @click="deleteGoal(goal._id)"
            class="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            :disabled="isDeleting"
          >
            Delete
          </button>
        </div>
        
        <!-- Transaction Form for this Goal -->
        <div v-if="activeTransactionForm === goal._id" class="mt-4 pt-4 border-t">
          <h4 class="font-medium mb-2">Add Transaction</h4>
          <form @submit.prevent="addTransaction(goal._id)">
            <div class="mb-2">
              <label class="block text-xs font-medium">Type</label>
              <select 
                v-model="transactionForm.transtype" 
                required
                class="w-full p-1 text-sm border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div class="mb-2">
              <label class="block text-xs font-medium">Amount (LKR)</label>
              <input 
                v-model.number="transactionForm.value" 
                type="number" 
                required
                min="0.01"
                step="0.01"
                class="w-full p-1 text-sm border rounded focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div class="mb-2">
              <label class="block text-xs font-medium">Account</label>
              <select 
                v-model="transactionForm.accountId" 
                required
                class="w-full p-1 text-sm border rounded focus:ring-2 focus:ring-blue-500"
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
            <div class="mb-2">
              <label class="block text-xs font-medium">Category</label>
              <select 
                v-model="transactionForm.category" 
                required
                class="w-full p-1 text-sm border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                <option value="food">Food</option>
                <option value="transportation">Transportation</option>
                <option value="entertainment">Entertainment</option>
                <option value="others">Others</option>
              </select>
            </div>
            <div class="mb-2">
              <label class="block text-xs font-medium">Description</label>
              <textarea 
                v-model="transactionForm.description" 
                class="w-full p-1 text-sm border rounded focus:ring-2 focus:ring-blue-500" 
                rows="2"
                placeholder="Optional description"
              ></textarea>
            </div>
            <div class="mb-2">
              <label class="block text-xs font-medium">Date</label>
              <input 
                v-model="transactionForm.date" 
                type="date" 
                required
                class="w-full p-1 text-sm border rounded focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div class="flex space-x-2">
              <button 
                type="submit" 
                class="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Processing...' : 'Save' }}
              </button>
              <button 
                type="button" 
                @click="cancelTransactionForm"
                class="text-sm bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
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
/* Add any custom styles here */
</style>