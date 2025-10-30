import './assets/main.css'
import 'primeicons/primeicons.css'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import Toast from 'primevue/toast'

import { initializeApp } from 'firebase/app'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import App from './App.vue'
import router from './router'
import Tooltip from 'primevue/tooltip'

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
app.use(createPinia())
app.use(router)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.use(ToastService)
// eslint-disable-next-line vue/multi-word-component-names
app.component('Toast', Toast)
app.use(ConfirmationService)
app.directive('Tooltip', Tooltip)
app.mount('#app')
