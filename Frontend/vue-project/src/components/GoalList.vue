<template>
  <div class="bg-white shadow-md rounded p-4">
    <h3 class="text-xl font-semibold mb-2">Goals</h3>
    <ul>
      <li v-for="goal in goals" :key="goal._id" class="border p-2 mb-2">
        {{ goal.name }}: {{ goal.currentAmount }} / {{ goal.targetAmount }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    goals: {
      type: Array,
      default: () => []
    }
  }
}
</script>