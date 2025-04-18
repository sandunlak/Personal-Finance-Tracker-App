<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>Welcome Back</h2>
        <p>Sign in to access your financial dashboard</p>
      </div>
      
      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label>Username</label>
          <input 
            v-model="username" 
            type="text" 
            class="form-input"
            placeholder="Enter your username"
            required
          />
          <svg class="input-icon" viewBox="0 0 20 20">
            <path d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"></path>
          </svg>
        </div>
        
        <div class="form-group">
          <label>Password</label>
          <input 
            v-model="password" 
            type="password" 
            class="form-input"
            placeholder="Enter your password"
            required
          />
          <svg class="input-icon" viewBox="0 0 20 20">
            <path d="M17.308,7.564h-1.993c0-2.929-2.385-5.314-5.314-5.314S4.686,4.635,4.686,7.564H2.693c-0.244,0-0.443,0.2-0.443,0.443v9.3c0,0.243,0.199,0.442,0.443,0.442h14.615c0.243,0,0.442-0.199,0.442-0.442v-9.3C17.75,7.764,17.551,7.564,17.308,7.564 M10,3.136c2.442,0,4.43,1.986,4.43,4.428H5.571C5.571,5.122,7.558,3.136,10,3.136 M16.865,16.864H3.136V8.45h13.729V16.864z M10,10.664c-0.854,0-1.55,0.696-1.55,1.551c0,0.699,0.467,1.292,1.107,1.485v0.95c0,0.243,0.2,0.442,0.443,0.442s0.443-0.199,0.443-0.442V13.7c0.64-0.193,1.106-0.786,1.106-1.485C11.55,11.36,10.854,10.664,10,10.664 M10,12.878c-0.366,0-0.664-0.298-0.664-0.663c0-0.366,0.298-0.665,0.664-0.665c0.365,0,0.664,0.299,0.664,0.665C10.664,12.58,10.365,12.878,10,12.878"></path>
          </svg>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="login-button">
            <span>Sign In</span>
            <svg class="button-icon" viewBox="0 0 20 20">
              <path d="M17.418,6.109c0.272-0.268,0.709-0.268,0.979,0s0.271,0.701,0,0.969l-7.908,7.83c-0.27,0.268-0.707,0.268-0.979,0l-7.908-7.83c-0.27-0.268-0.27-0.701,0-0.969c0.271-0.268,0.709-0.268,0.979,0L10,13.25L17.418,6.109z"></path>
            </svg>
          </button>
          
          <div class="forgot-password">
            <a href="#">Forgot password?</a>
          </div>
        </div>
      </form>
      
      <div class="login-footer">
        <p>Don't have an account? <router-link to="/register" class="register-link">Create account</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import { useToast } from 'vue-toastification'

export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async login() {
      const toast = useToast()
      try {
        await useAuthStore().login(this.username, this.password)
        toast.success('Login successful')
        this.$router.push('/dashboard')
      } catch (error) {
        toast.error(error)
      }
    }
  }
}
</script>

<style>
:root {
  --primary-color: #4f46e5;
  --primary-hover: #4338ca;
  --text-color: #374151;
  --light-gray: #f3f4f6;
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
  background-color: #f9fafb;
  color: var(--text-color);
  line-height: 1.6;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f9fafb;
  background-image: 
    radial-gradient(at 10% 20%, rgba(79, 70, 229, 0.05) 0, transparent 50%),
    radial-gradient(at 90% 80%, rgba(79, 70, 229, 0.05) 0, transparent 50%);
}

.login-card {
  width: 100%;
  max-width: 36rem; /* Increased from 28rem */
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 10px 25px -5px var(--shadow-color);
  overflow: hidden;
  transition: transform var(--transition-speed) ease, box-shadow var(--transition-speed) ease;
  padding: 3rem; /* Added padding to make the card larger */
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.login-header {
  padding: 1rem 0 2rem; /* Adjusted padding */
  text-align: center;
}

.login-header h2 {
  font-size: 2rem; /* Increased from 1.75rem */
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.75rem; /* Increased from 0.5rem */
}

.login-header p {
  color: #6b7280;
  font-size: 1.1rem; /* Increased from 0.95rem */
}

.login-form {
  padding: 0 0 2rem; /* Adjusted padding */
}

.form-group {
  position: relative;
  margin-bottom: 2rem; /* Increased from 1.5rem */
}

.form-group label {
  display: block;
  font-size: 1rem; /* Increased from 0.875rem */
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.75rem; /* Increased from 0.5rem */
}

.form-input {
  width: 100%;
  padding: 1.25rem 1rem 1.25rem 3rem; /* Increased padding */
  font-size: 1.1rem; /* Increased from 0.95rem */
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  background-color: var(--light-gray);
  transition: all var(--transition-speed) ease;
  height: 3.5rem; /* Added fixed height */
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
  background-color: white;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 3.1rem; /* Adjusted position */
  width: 1.5rem; /* Increased from 1.25rem */
  height: 1.5rem; /* Increased from 1.25rem */
  fill: #9ca3af;
  transition: fill var(--transition-speed) ease;
}

.form-input:focus + .input-icon {
  fill: var(--primary-color);
}

.form-actions {
  margin-top: 2.5rem; /* Increased from 2rem */
}

.login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1.25rem; /* Increased from 1rem */
  font-size: 1.1rem; /* Increased from 1rem */
  font-weight: 600;
  color: white;
  background-color: var(--primary-color);
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.3);
  height: 3.5rem; /* Added fixed height */
}

.login-button:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
}

.login-button:active {
  transform: translateY(0);
}

.button-icon {
  width: 1.5rem; /* Increased from 1.25rem */
  height: 1.5rem; /* Increased from 1.25rem */
  margin-left: 0.75rem; /* Increased from 0.5rem */
  fill: white;
  transform: rotate(-90deg);
  transition: transform var(--transition-speed) ease;
}

.login-button:hover .button-icon {
  transform: rotate(-90deg) translateX(3px);
}

.forgot-password {
  text-align: center;
  margin-top: 1.5rem; /* Increased from 1rem */
}

.forgot-password a {
  color: #6b7280;
  font-size: 1rem; /* Increased from 0.875rem */
  text-decoration: none;
  transition: color var(--transition-speed) ease;
}

.forgot-password a:hover {
  color: var(--primary-color);
  text-decoration: underline;
}

.login-footer {
  padding: 1.5rem 0 0; /* Adjusted padding */
  text-align: center;
  border-top: 1px solid var(--border-color);
  font-size: 1.05rem; /* Increased from 0.95rem */
  color: #6b7280;
}

.register-link {
  color: var(--primary-color);
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-speed) ease;
}

.register-link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-container {
    padding: 1rem;
  }
  
  .login-card {
    border-radius: 1rem;
    padding: 2rem; /* Adjusted for mobile */
  }
  
  .login-header h2 {
    font-size: 1.75rem;
  }
  
  .login-header p {
    font-size: 1rem;
  }
  
  .form-input {
    padding: 1rem 1rem 1rem 2.75rem;
    height: 3rem;
  }
  
  .input-icon {
    top: 2.6rem;
  }
}
</style>