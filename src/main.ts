import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

// Initialize Pinia
const pinia = createPinia()

// Create and mount app
const app = createApp(App)
app.use(pinia)
app.mount('#app')

// Expose the API for external access
declare global {
  interface Window {
    addUser: (username: string, level?: number) => boolean;
  }
}