<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Password from 'primevue/password'
import Toast from 'primevue/toast'

import { computed, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import { useAppToast } from '@/composables/useAppToast'
import { PATH } from '@/router/path'

const router = useRouter()
const { login, register, isLoading } = useAuth()
const { warnToast } = useAppToast()

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
    warnToast('Введите email и пароль')
    return
  }
  const success = isLogin.value
    ? await login(email.value, password.value)
    : await register(email.value, password.value)

  if (success) {
    router.push(PATH.Home)
  }
}

const submitButtonText = computed<string>(() => (isLogin.value ? 'Вход' : 'Регистрация'))
</script>

<template>
  <Toast position="bottom-right" />

  <div class="auth-page">
    <div class="auth-page__card">
      <div class="auth-page-__header">
        <h2 class="auth-page__title">Приветствую</h2>
        <p class="auth-page__subtitle">
          {{ subtitleText }}
          <a class="auth-page__link" @click="toggleAuth">{{ linkAccountText }}</a>
        </p>
      </div>

      <form class="auth-page__form" @submit.prevent="submitForm">
        <div class="auth-page__field">
          <label for="email1" class="auth-page__label"></label>
          <InputText
            v-model="email"
            class="auth-page__input"
            id="email1"
            type="email"
            placeholder="Email"
          />
        </div>

        <div class="auth-page__field">
          <label for="password1" class="auth-page__label"></label>
          <Password
            v-model="password"
            class="auth-page__input"
            :feedback="false"
            fluid
            placeholder="Password"
          />
        </div>
        <Button
          class="auth-page__submit"
          type="submit"
          :label="submitButtonText"
          icon="pi pi-user"
          :loading="isLoading"
        />
      </form>
    </div>
  </div>
</template>
<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.auth-page__card {
  width: 100%;
  max-width: 500px;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.01);
}
.auth-page__header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.auth-page__title {
  font-size: 2rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}
.auth-page__subtitle {
  display: inline-block;
  font-weight: 400;
  line-height: 1.5;
}

.auth-page__link {
  margin-left: 0.5rem;
  font-weight: 500;
  color: var(--blue-500, #3b82f6);
  cursor: pointer;
  text-decoration: none;
}

.auth-page__form {
  display: flex;
  flex-direction: column;
}

.auth-page__field {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.auth-page__label {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.auth-page__submit {
  width: 100%;
}
.auth-page__input {
  width: 100%;
}
</style>
