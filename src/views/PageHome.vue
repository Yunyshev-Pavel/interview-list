<script setup lang="ts">
import { computed, ref } from 'vue'
import type { IInterview } from '@/interfaces'
import { getFirestore, setDoc, doc } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const loading = ref<boolean>(false)
const router = useRouter()
const db = getFirestore()

const company = ref<string>('')
const vacancyLink = ref<string>('')
const hrName = ref<string>('')
const contactTelegram = ref<string>('')
const contactPhone = ref<string>('')

const addNewInterview = async (): Promise<void> => {
  loading.value = true
  const id = crypto.randomUUID()
  const payload: IInterview = {
    id,
    company: company.value,
    vacancyLink: vacancyLink.value,
    hrName: hrName.value,
    contactTelegram: contactTelegram.value,
    contactPhone: contactPhone.value,
    createdAt: new Date(),
  }
  if (userStore.userId) {
    await setDoc(doc(db, `users/${userStore.userId}/interviews`, payload.id), payload).then(() => {
      router.push('/list')
    })
  }
}

const disabledSaveButton = computed<boolean>(() => {
  return !(company.value && vacancyLink.value && hrName.value)
})
</script>

<template>
  <div class="page--home">
    <Card>
      <template #title>Новое собеседования</template>
      <template #content>
        <form class="page__form" @submit.prevent="addNewInterview">
          <InputText v-model="company" class="page__input" placeholder="Компания" />
          <InputText v-model="vacancyLink" class="page__input" placeholder="Описание вакансии" />
          <InputText v-model="hrName" class="page__input" placeholder="Контакт (имя)" />
          <InputText
            v-model="contactTelegram"
            class="page__input"
            placeholder="Telegram username Hr"
          />
          <InputText v-model="contactPhone" class="page__input" placeholder="Телефон HR" />
          <Button
            type="submit"
            label="Создать cобеседование"
            :disabled="disabledSaveButton"
            :loading="loading"
            icon="pi pi-check"
          ></Button>
        </form>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.page--home {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}
.page__input {
  width: 100%;
}
.page__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
