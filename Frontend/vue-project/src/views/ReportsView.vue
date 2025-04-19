<template>
  <div class="reports-view container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-center">Income vs. Expenses Report</h1>

    <!-- Filters -->
    <div class="filters mb-8 p-6 bg-gray-100 rounded-lg shadow">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            v-model="filters.startDate"
            type="date"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            @change="fetchData"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">End Date</label>
          <input
            v-model="filters.endDate"
            type="date"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            @change="fetchData"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
          <input
            v-model="filters.tags"
            type="text"
            placeholder="e.g., food,travel"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            @input="fetchData"
          />
        </div>
      </div>
    </div>

    <!-- Transactions Table -->
    <div class="transactions mt-8 bg-white p-6 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4">Transaction Details</h2>
      <div class="grid grid-cols-1 gap-6">
        <!-- Income Transactions -->
        <div>
          <h3 class="text-lg font-medium mb-2">Income Transactions</h3>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="transaction in incomeTransactions" :key="transaction._id">
                <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(transaction.date) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ transaction.category }}</td>
                <td class="px-6 py-4 whitespace-nowrap">${{ transaction.value.toFixed(2) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ transaction.tags.join(', ') }}</td>
              </tr>
              <tr v-if="!incomeTransactions.length">
                <td colspan="4" class="px-6 py-4 text-center text-gray-500">No income transactions available</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Expense Transactions -->
        <div>
          <h3 class="text-lg font-medium mb-2">Expense Transactions</h3>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="transaction in expenseTransactions" :key="transaction._id">
                <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(transaction.date) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ transaction.category }}</td>
                <td class="px-6 py-4 whitespace-nowrap">${{ transaction.value.toFixed(2) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ transaction.tags.join(', ') }}</td>
              </tr>
              <tr v-if="!expenseTransactions.length">
                <td colspan="4" class="px-6 py-4 text-center text-gray-500">No expense transactions available</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { reactive, toRefs } from 'vue';

export default {
  name: 'IncomeExpensesReport',
  setup() {
    // Use reactive state to ensure Vue reactivity
    const state = reactive({
      filters: {
        startDate: '',
        endDate: '',
        tags: '',
      },
      incomeTotal: 0,
      expenseTotal: 0,
      incomeTransactions: [],
      expenseTransactions: [],
    });

    // Set default date range (last 30 days)
    const initializeFilters = () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);
      state.filters.startDate = startDate.toISOString().split('T')[0];
      state.filters.endDate = endDate.toISOString().split('T')[0];
    };

    // Fetch data from API
    const fetchData = async () => {
      try {
        const params = {
          startDate: state.filters.startDate,
          endDate: state.filters.endDate,
          tags: state.filters.tags,
        };
        const response = await axios.get('/FinancialReports/income-expenses', { params });
        const { income, expense } = response.data;

        // Update totals and transactions
        state.incomeTotal = income.total || 0;
        state.expenseTotal = expense.total || 0;
        state.incomeTransactions = income.transactions || [];
        state.expenseTransactions = expense.transactions || [];
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Format date for display
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString();
    };

    // Initialize filters and fetch data on mount
    initializeFilters();
    fetchData();

    return {
      ...toRefs(state),
      fetchData,
      formatDate,
    };
  },
};
</script>

<style scoped>
.reports-view {
  max-width: 1400px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  padding: 8px;
}
</style>