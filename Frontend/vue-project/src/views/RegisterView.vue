<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h2>Create Your Account</h2>
        <p>Join us to manage your finances effectively</p>
      </div>
      
      <form @submit.prevent="register" class="register-form" enctype="multipart/form-data">
        <div class="form-group">
          <label>Username</label>
          <input 
            v-model="username" 
            type="text" 
            class="form-input"
            placeholder="Choose a username"
            required
          />
          <svg class="input-icon" viewBox="0 0 20 20">
            <path d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"></path>
          </svg>
        </div>
        
        <div class="form-group">
          <label>Email</label>
          <input 
            v-model="email" 
            type="email" 
            class="form-input"
            placeholder="Enter your email"
            required
          />
          <svg class="input-icon" viewBox="0 0 20 20">
            <path d="M14.608,12.172c0,0.84,0.239,1.175,0.864,1.175c1.393,0,2.28-1.775,2.28-4.727c0-4.512-3.288-6.672-7.393-6.672c-4.223,0-8.064,2.832-8.064,8.184c0,5.112,3.36,7.896,8.52,7.896c1.752,0,2.928-0.192,4.727-0.792l0.386,1.607c-1.776,0.577-3.674,0.744-5.137,0.744c-6.768,0-10.393-3.72-10.393-9.456c0-5.784,4.201-9.72,9.985-9.72c6.024,0,9.215,3.6,9.215,8.016c0,3.744-1.175,6.6-4.871,6.6c-1.681,0-2.784-0.672-2.928-2.161c-0.432,1.656-1.584,2.161-3.145,2.161c-2.088,0-3.84-1.609-3.84-4.848c0-3.264,1.537-5.28,4.297-5.28c1.464,0,2.376,0.576,2.782,1.488l0.697-1.272h2.016v7.057h-2.016V12.172z M11.177,12.338c0-1.319-0.985-1.872-1.801-1.872c-0.888,0-1.871,0.719-1.871,2.832c0,1.68,0.744,2.616,1.871,2.616c0.984,0,1.801-0.504,1.801-1.632V12.338z"></path>
          </svg>
        </div>
        
        <div class="form-group">
          <label>Password</label>
          <input 
            v-model="password" 
            type="password" 
            class="form-input"
            placeholder="Create a password"
            required
          />
          <svg class="input-icon" viewBox="0 0 20 20">
            <path d="M17.308,7.564h-1.993c0-2.929-2.385-5.314-5.314-5.314S4.686,4.635,4.686,7.564H2.693c-0.244,0-0.443,0.2-0.443,0.443v9.3c0,0.243,0.199,0.442,0.443,0.442h14.615c0.243,0,0.442-0.199,0.442-0.442v-9.3C17.75,7.764,17.551,7.564,17.308,7.564 M10,3.136c2.442,0,4.43,1.986,4.43,4.428H5.571C5.571,5.122,7.558,3.136,10,3.136 M16.865,16.864H3.136V8.45h13.729V16.864z M10,10.664c-0.854,0-1.55,0.696-1.55,1.551c0,0.699,0.467,1.292,1.107,1.485v0.95c0,0.243,0.2,0.442,0.443,0.442s0.443-0.199,0.443-0.442V13.7c0.64-0.193,1.106-0.786,1.106-1.485C11.55,11.36,10.854,10.664,10,10.664 M10,12.878c-0.366,0-0.664-0.298-0.664-0.663c0-0.366,0.298-0.665,0.664-0.665c0.365,0,0.664,0.299,0.664,0.665C10.664,12.58,10.365,12.878,10,12.878"></path>
          </svg>
        </div>
        
        <div class="form-group">
          <label>Profile Photo (Optional)</label>
          <div class="file-upload-wrapper">
            <input 
              type="file" 
              @change="handleFileUpload" 
              class="file-upload-input"
              accept="image/*"
            />
            <div class="file-upload-label">
              <svg class="file-upload-icon" viewBox="0 0 24 24">
                <path d="M19,13a1,1,0,0,0-1,1v.38L16.52,12.9a2.79,2.79,0,0,0-3.93,0l-.7.7L9.41,11.12a2.85,2.85,0,0,0-3.93,0L4,12.6V7A1,1,0,0,1,5,6h7a1,1,0,0,0,0-2H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V14A1,1,0,0,0,19,13ZM5,20a1,1,0,0,1-1-1V15.43l2.9-2.9a.79.79,0,0,1,1.09,0l3.17,3.17,0,0L15.45,20Zm13-1a.89.89,0,0,1-.18.53L13.31,15l.7-.7a.77.77,0,0,1,1.1,0L18,17.21ZM22.71,4.29l-3-3a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21l-3,3a1,1,0,0,0,1.42,1.42L18,4.41V10a1,1,0,0,0,2,0V4.41l1.29,1.3a1,1,0,0,0,1.42,0A1,1,0,0,0,22.71,4.29Z"/>
              </svg>
              <span>{{ photo ? photo.name : 'Choose a file' }}</span>
            </div>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="register-button">
            <span>Create Account</span>
            <svg class="button-icon" viewBox="0 0 20 20">
              <path d="M17.418,6.109c0.272-0.268,0.709-0.268,0.979,0s0.271,0.701,0,0.969l-7.908,7.83c-0.27,0.268-0.707,0.268-0.979,0l-7.908-7.83c-0.27-0.268-0.27-0.701,0-0.969c0.271-0.268,0.709-0.268,0.979,0L10,13.25L17.418,6.109z"></path>
            </svg>
          </button>
        </div>
      </form>
      
      <div class="register-footer">
        <p>Already have an account? <router-link to="/login" class="login-link">Sign in</router-link></p>
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
      email: '',
      password: '',
      photo: null
    }
  },
  methods: {
    handleFileUpload(event) {
      this.photo = event.target.files[0]
    },
    async register() {
      const toast = useToast()
      try {
        await useAuthStore().register(this.username, this.email, this.password, this.photo)
        toast.success('Registration successful')
        this.$router.push('/login')
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

.register-container {
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

.register-card {
  width: 100%;
  max-width: 42rem; /* Extra large size */
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 15px 30px -10px var(--shadow-color);
  overflow: hidden;
  transition: transform var(--transition-speed) ease, box-shadow var(--transition-speed) ease;
  padding: 4rem; /* Increased padding */
}

.register-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px -15px rgba(0, 0, 0, 0.15);
}

.register-header {
  padding: 0 0 3rem; /* Adjusted padding */
  text-align: center;
}

.register-header h2 {
  font-size: 2.25rem; /* Larger heading */
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
}

.register-header p {
  color: #6b7280;
  font-size: 1.2rem; /* Larger subtitle */
}

.register-form {
  padding: 0 0 2rem;
}

.form-group {
  position: relative;
  margin-bottom: 2.5rem; /* More spacing */
}

.form-group label {
  display: block;
  font-size: 1.1rem; /* Larger labels */
  font-weight: 500;
  color: #374151;
  margin-bottom: 1rem; /* More spacing */
}

.form-input {
  width: 100%;
  padding: 1.5rem 1rem 1.5rem 3.5rem; /* Larger padding */
  font-size: 1.1rem; /* Larger text */
  border: 1px solid var(--border-color);
  border-radius: 1rem; /* More rounded */
  background-color: var(--light-gray);
  transition: all var(--transition-speed) ease;
  height: 4rem; /* Taller inputs */
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
  background-color: white;
}

.input-icon {
  position: absolute;
  left: 1.25rem;
  top: 3.5rem; /* Adjusted position */
  width: 1.75rem; /* Larger icons */
  height: 1.75rem;
  fill: #9ca3af;
  transition: fill var(--transition-speed) ease;
}

.form-input:focus + .input-icon {
  fill: var(--primary-color);
}

.file-upload-wrapper {
  position: relative;
  margin-top: 0.5rem;
}

.file-upload-input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.file-upload-label {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1.5rem;
  font-size: 1.1rem;
  border: 2px dashed var(--border-color);
  border-radius: 1rem;
  background-color: var(--light-gray);
  transition: all var(--transition-speed) ease;
  height: 4rem; /* Same height as other inputs */
}

.file-upload-label:hover {
  border-color: var(--primary-color);
  background-color: rgba(79, 70, 229, 0.05);
}

.file-upload-icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 1rem;
  fill: var(--primary-color);
}

.form-actions {
  margin-top: 3rem; /* More spacing */
}

.register-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1.5rem; /* Larger button */
  font-size: 1.2rem; /* Larger text */
  font-weight: 600;
  color: white;
  background-color: var(--primary-color);
  border: none;
  border-radius: 1rem; /* More rounded */
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  box-shadow: 0 8px 15px -3px rgba(79, 70, 229, 0.3);
  height: 4.5rem; /* Taller button */
}

.register-button:hover {
  background-color: var(--primary-hover);
  transform: translateY(-3px); /* More pronounced hover */
  box-shadow: 0 15px 20px -5px rgba(79, 70, 229, 0.4);
}

.register-button:active {
  transform: translateY(0);
}

.button-icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-left: 1rem; /* More spacing */
  fill: white;
  transform: rotate(-90deg);
  transition: transform var(--transition-speed) ease;
}

.register-button:hover .button-icon {
  transform: rotate(-90deg) translateX(5px); /* More pronounced animation */
}

.register-footer {
  padding: 2rem 0 0;
  text-align: center;
  border-top: 1px solid var(--border-color);
  font-size: 1.1rem; /* Larger text */
  color: #6b7280;
}

.login-link {
  color: var(--primary-color);
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-speed) ease;
}

.login-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .register-container {
    padding: 1.5rem;
  }
  
  .register-card {
    padding: 2.5rem;
    max-width: 100%;
  }
  
  .register-header h2 {
    font-size: 2rem;
  }
  
  .register-header p {
    font-size: 1.1rem;
  }
  
  .form-input {
    padding: 1.25rem 1rem 1.25rem 3rem;
    height: 3.5rem;
  }
  
  .input-icon {
    top: 3rem;
  }
  
  .register-button {
    height: 4rem;
    font-size: 1.1rem;
  }
}
</style>