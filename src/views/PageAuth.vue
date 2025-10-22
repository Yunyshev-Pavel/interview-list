<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue'

const router = useRouter()
const { login, register, isLoading } = useAuth()
const toast = useToast()

const email = ref<string>('')
const password = ref<string>('')
const isLogin = ref<boolean>(true)

const toggleAuth = () => {
  isLogin.value = !isLogin.value
}

const subtitleText = computed<string>(() => {
  return isLogin.value ? 'Аккаунта нет?' : 'Есть аккаунт?'
})

const linkAccountText = computed<string>(() => {
  return isLogin.value ? 'Создайте?' : 'Войдите?'
})

const submitForm = async () => {
  if (!email.value || !password.value) {
    toast.add({
      severity: 'warn',
      summary: 'Ошибка',
      detail: 'Введите email и пароль',
      life: 3000,
    })
    return
  }
  const success = isLogin.value
    ? await login(email.value, password.value)
    : await register(email.value, password.value)

  if (success) router.push('/')
}

const submitButtonText = computed<string>(() => (isLogin.value ? 'Вход' : 'Регистрация'))
</script>

<template>
  <Toast position="bottom-right" />

  <div class="auth">
    <div class="auth__card">
      <div class="auth__header">
        <h2 class="auth__title">Приветствую</h2>
        <p class="auth__subtitle">
          {{ subtitleText }}
          <a class="auth__link auth__link--switch" @click="toggleAuth">{{ linkAccountText }}</a>
        </p>
      </div>

      <form class="auth__form" @submit.prevent="submitForm">
        <div class="auth__field">
          <label for="email1" class="auth__label">Email</label>
          <InputText
            v-model="email"
            class="auth__input"
            id="email1"
            type="email"
            placeholder="Email"
          />
        </div>

        <div class="auth__field">
          <label for="password1" class="auth__label">Пароль</label>
          <Password
            v-model="password"
            class="auth__input"
            :feedback="false"
            fluid
            placeholder="Password"
          />
        </div>
        <Button
          class="auth__button"
          type="submit"
          severity="secondary"
          :label="submitButtonText"
          icon="pi pi-user"
          :loading="isLoading"
        />
      </form>
    </div>
  </div>
</template>
<style scoped>
.auth {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  min-height: 100vh;
}

.auth__card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  padding: 1.8rem;
  width: 100%;
  max-width: 380px;
}

.auth__title {
  font-size: 1.7rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.3rem;
}
.auth__subtitle {
  text-align: center;
  font-size: 0.95rem;
  color: #6b7280;
  margin-bottom: 1.2rem;
}

.auth__link {
  color: #3b82f6;
  margin-left: 0.3rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;
}

.auth__link:hover {
  text-decoration: underline;
  color: #2563eb;
}

.auth__form {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.auth__field {
  display: flex;
  flex-direction: column;
}

.auth__label {
  font-weight: 500;
  font-size: 0.9rem;
  margin-bottom: 0.2rem;
}

.auth__button {
  margin-top: 0.8rem;
  width: 100%;
  border: none !important;
  font-weight: 500;
}
</style>
