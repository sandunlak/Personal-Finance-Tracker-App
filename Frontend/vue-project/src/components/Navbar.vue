<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="navbar-brand">Finance Tracker</router-link>
      <div class="navbar-links">
        <router-link v-if="!isLoggedIn" to="/login" class="nav-link">Login</router-link>
        <router-link v-if="!isLoggedIn" to="/register" class="nav-link nav-link-primary">Register</router-link>
        <router-link v-if="isLoggedIn" to="/dashboard" class="nav-link">Dashboard</router-link>
        <router-link v-if="isLoggedIn && isAdmin" to="/admin" class="nav-link">Admin</router-link>
        <button v-if="isLoggedIn" @click="logout" class="nav-button">Logout</button>
      </div>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
  computed: {
    isLoggedIn() {
      return !!useAuthStore().token
    },
    isAdmin() {
      return useAuthStore().role === 'admin'
    }
  },
  methods: {
    logout() {
      useAuthStore().logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style>
:root {
  --primary-color: #2563eb;
  --primary-hover: #1d4ed8;
  --text-light: #ffffff;
  --text-dark: #1e293b;
  --transition-speed: 0.3s;
}

.navbar {
  background-color: var(--primary-color);
  color: var(--text-light);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  font-size: 1.25rem;
  font-weight: 700;
  text-decoration: none;
  color: var(--text-light);
  transition: opacity var(--transition-speed) ease;
}

.navbar-brand:hover {
  opacity: 0.9;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: var(--text-light);
  text-decoration: none;
  font-weight: 500;
  position: relative;
  padding: 0.5rem 0;
  transition: all var(--transition-speed) ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--text-light);
  transition: width var(--transition-speed) ease;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link-primary {
  background-color: var(--text-light);
  color: var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all var(--transition-speed) ease;
}

.nav-link-primary:hover {
  background-color: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
}

.nav-link-primary::after {
  display: none;
}

.nav-button {
  background: none;
  border: none;
  color: var(--text-light);
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 0;
  font-family: inherit;
  font-size: inherit;
  position: relative;
}

.nav-button::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--text-light);
  transition: width var(--transition-speed) ease;
}

.nav-button:hover::after {
  width: 100%;
}

@media (max-width: 768px) {
  .navbar-container {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .navbar-links {
    width: 100%;
    justify-content: space-around;
    gap: 0.5rem;
  }
  
  .nav-link, .nav-button {
    font-size: 0.9rem;
  }
}
</style>