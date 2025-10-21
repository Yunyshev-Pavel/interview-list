/* eslint-disable vue/no-reserved-component-names */
/* eslint-disable vue/multi-word-component-names */
import './assets/main.css'
import 'primeicons/primeicons.css'
import Aura from '@primeuix/themes/aura'
import { InputText, Password, Toast, Menubar, Button, ToastService } from 'primevue'

import { initializeApp } from 'firebase/app'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import App from './App.vue'
import router from './router'

const firebaseConfig = {
  apiKey: 'AIzaSyDiwcfMhH0_F__wqc8X4FjycxNTgLZ0_Ss',
  authDomain: 'interview-list-8e1ed.firebaseapp.com',
  projectId: 'interview-list-8e1ed',
  storageBucket: 'interview-list-8e1ed.firebasestorage.app',
  messagingSenderId: '382843124683',
  appId: '1:382843124683:web:d0a087cfa49f9a8b83d44e',
  measurementId: 'G-HB82MV72SF',
}

initializeApp(firebaseConfig)

const app = createApp(App)

app.use(ToastService)
app.use(createPinia())
app.use(router)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.component('ToastService', ToastService)

app.component('InputText', InputText)
app.component('Toast', Toast)
app.component('Password', Password)
app.component('Button', Button)
app.component('Menubar', Menubar)

app.mount('#app')
