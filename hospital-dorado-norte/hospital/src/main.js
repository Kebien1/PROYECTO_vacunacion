import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import { requiereSesion } from './auth.js'
import './styles.css'

requiereSesion()

createApp(App).use(router).mount('#app')
