import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import AdminPanelView from '../views/AdminPanelView.vue'
import AddAccount from '../views/AddAccount.vue'
import AddBudgetView from '../views/AddBudget.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/admin', name: 'admin', component: AdminPanelView, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/add-account', name: 'addAccoumnt', component: AddAccount, meta: { requiresAuth: true } },
  { path: '/add-budget', name: 'add-budget', component: AddBudgetView, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (to.meta.requiresAuth && !token) {
    return next('/login')
  }

  if (to.meta.requiresAdmin && role !== 'admin') {
    return next('/dashboard')
  }

  next()
})

export default router