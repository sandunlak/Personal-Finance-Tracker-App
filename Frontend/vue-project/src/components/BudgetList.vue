<template>
  <div class="bg-white shadow-md rounded p-4">
    <h3 class="text-xl font-semibold mb-2">Budgets</h3>
    <ul>
      <li v-for="budget in budgets" :key="budget._id" class="border p-2 mb-2">
        {{ budget.category }}: {{ budget.amount }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    budgets: {
      type: Array,
      default: () => []
    }
  }
}
</script>