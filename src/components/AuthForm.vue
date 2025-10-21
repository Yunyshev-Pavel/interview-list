<script setup lang="ts">
import { Toast } from 'primevue'
import { computed, ref } from 'vue'
// import { InputText, Password, Toast } from 'primevue'

const toggleAuth = () => {
  isLogin.value = !isLogin.value
}

const isLogin = ref<boolean>(true)
const subtitleText = computed<string>(() => {
  return isLogin.value ? 'Аккаунта нет?' : 'Есть аккаунт?'
})

const linkAccountText = computed<string>(() => {
  return isLogin.value ? 'Войдите?' : 'Создайте?'
})
</script>

<template>
  <Toast position="bottom-right" />
  <div class="container-auth">
    <div>
      <div>
        <div>Приветсвую</div>
        <span>{{ subtitleText }}</span>
        <a @click="toggleAuth">{{ linkAccountText }}</a>
      </div>
    </div>
    <!-- <form @submit.prevent="submitForm">
      <label for="email1">Email</label>
      <InputText v-model="email" id="email1" type="email" placeholder="Введите email" />

      <span>
        <label for="password">Пароль</label>
        <Password v-model="password" :feedback="false" toggleMask placeholder="Введите пароль" />
      </span>
      <Button type="submit" label="войти" icon="pi pi-sign-in" />
    </form> -->
  </div>
</template>
<style scoped></style>
