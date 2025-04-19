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
.navbar {
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
  color: #ffffff;
  padding: 1.2rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.navbar-container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: 800;
  text-decoration: none;
  color: #ffffff;
  letter-spacing: 0.5px;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.navbar-brand:hover {
  opacity: 0.85;
  transform: scale(1.05);
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.75rem 0;
  position: relative;
  transition: color 0.3s ease, transform 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 3px;
  background: linear-gradient(to right, #facc15, #f97316);
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: #facc15;
  transform: translateY(-2px);
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link-primary {
  background: linear-gradient(135deg, #facc15, #f97316);
  color: #1e293b;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 700;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.nav-link-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(249, 115, 22, 0.4);
}

.nav-link-primary::after {
  display: none;
}

.nav-button {
  background: none;
  border: none;
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.75rem 0;
  font-family: inherit;
  position: relative;
  transition: color 0.3s ease, transform 0.3s ease;
}

.nav-button::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 3px;
  background: linear-gradient(to right, #facc15, #f97316);
  transition: width 0.3s ease;
}

.nav-button:hover {
  color: #facc15;
  transform: translateY(-2px);
}

.nav-button:hover::after {
  width: 100%;
}

@media (max-width: 768px) {
  .navbar-container {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
  }
  
  .navbar-links {
    width: 100%;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .nav-link, .nav-button {
    font-size: 0.95rem;
    padding: 0.5rem;
  }
  
  .nav-link-primary {
    padding: 0.6rem 1.2rem;
  }
}
</style>