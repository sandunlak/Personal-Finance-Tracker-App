<template>
  <div class="app-container">
    <div class="animated-background"></div>
    <main class="main-content">
      <div class="welcome-card">
        <h1 class="main-heading">
          Welcome to Personal Finance Tracker
        </h1>
        
        <p class="subtitle">
          Take control of your financial future with our intuitive money management tools.
        </p>
        
        <div class="button-group">
          <router-link to="/login" class="primary-button">
            Login
          </router-link>
          
          <router-link to="/register" class="secondary-button">
            Register
          </router-link>
        </div>
      </div>
      
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3>Track Expenses</h3>
          <p>Monitor your spending habits with detailed analytics and categorization to understand where your money goes each month.</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3>Create Budgets</h3>
          <p>Set personalized financial goals, allocate funds to different categories, and receive alerts when approaching limits.</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3>Visual Reports</h3>
          <p>Interactive dashboards with beautiful charts and graphs to visualize your financial health at a glance.</p>
        </div>
      </div>
    </main>
    
    <footer class="app-footer">
      © 2023 Personal Finance Tracker. All rights reserved.
    </footer>
  </div>
</template>

<style>
:root {
  --primary-color: #4f46e5;
  --primary-hover: #4338ca;
  --text-color: #374151;
  --light-bg: #f8fafc;
  --card-bg: rgba(255, 255, 255, 0.9);
  --animation-duration: 15s;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
}

.app-container {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.animated-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%);
  z-index: -1;
}

.animated-background::before,
.animated-background::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: rgba(79, 70, 229, 0.1);
  animation: float var(--animation-duration) infinite ease-in-out;
}

.animated-background::before {
  width: 300px;
  height: 300px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.animated-background::after {
  width: 400px;
  height: 400px;
  bottom: 15%;
  right: 10%;
  animation-delay: calc(var(--animation-duration) / 3);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(5deg);
  }
  50% {
    transform: translateY(0) rotate(10deg);
  }
  75% {
    transform: translateY(20px) rotate(5deg);
  }
}

.main-content {
  flex-grow: 1;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.welcome-card {
  width: 100%;
  max-width: 900px;
  text-align: center;
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  border-radius: 2rem;
  padding: 4rem 3rem;
  margin-bottom: 4rem;
  box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.welcome-card:hover {
  box-shadow: 0 25px 50px -15px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

.main-heading {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 2rem;
  background: linear-gradient(90deg, #4f46e5, #2563eb);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 1.2;
}

.subtitle {
  font-size: 1.5rem;
  margin-bottom: 3rem;
  color: #4b5563;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.button-group {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.primary-button, .secondary-button {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 0.75rem;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
}

.primary-button {
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1);
}

.primary-button:hover {
  background-color: var(--primary-hover);
  transform: translateY(-3px);
  box-shadow: 0 15px 20px -5px rgba(0, 0, 0, 0.15);
}

.secondary-button {
  background-color: white;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1);
}

.secondary-button:hover {
  background-color: #f5f7ff;
  transform: translateY(-3px);
  box-shadow: 0 15px 20px -5px rgba(0, 0, 0, 0.15);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  width: 100%;
  max-width: 1200px;
  margin-top: 3rem;
}

.feature-card {
  background: var(--card-bg);
  padding: 2.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
  min-height: 320px;
  display: flex;
  flex-direction: column;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  width: 3.5rem;
  height: 3.5rem;
  margin-bottom: 2rem;
  color: var(--primary-color);
}

.feature-icon svg {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  color: var(--primary-color);
}

.feature-card p {
  color: #6b7280;
  font-size: 1.1rem;
  line-height: 1.7;
}

.app-footer {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-size: 1rem;
  margin-top: 3rem;
}

@media (max-width: 768px) {
  .main-heading {
    font-size: 2.25rem;
  }
  
  .subtitle {
    font-size: 1.25rem;
  }
  
  .welcome-card {
    padding: 3rem 2rem;
    border-radius: 1.5rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .feature-card {
    min-height: auto;
    padding: 2rem;
  }
  
  .button-group {
    gap: 1rem;
  }
  
  .primary-button, .secondary-button {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
}
</style>