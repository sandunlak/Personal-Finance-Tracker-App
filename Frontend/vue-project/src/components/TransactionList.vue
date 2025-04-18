<template>
  <div class="bg-white shadow-md rounded p-4">
    <h3 class="text-xl font-semibold mb-2">Transactions</h3>
    <ul>
      <li v-for="transaction in transactions" :key="transaction._id" class="border p-2 mb-2">
        <span :class="transaction.transtype === 'income' ? 'text-green-500' : 'text-red-500'">
          {{ transaction.transtype }}: {{ transaction.value }}
        </span>
        on {{ new Date(transaction.date).toLocaleDateString() }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    transactions: {
      type: Array,
      default: () => []
    }
  }
}
</script>