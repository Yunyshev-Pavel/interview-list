<script setup lang="ts">
import { computed, reactive } from 'vue'
import type { Interview } from '@/interfaces'

import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Card from 'primevue/card'
import { useInterview } from '@/composables/useInterviews'

const { addNewInterview, loading } = useInterview()
const interviewForm = reactive<Omit<Interview, 'id' | 'createdAt'>>({
  company: '',
  vacancyLink: '',
  hrName: '',
  contactTelegram: '',
  contactPhone: '',
})

const disabledSaveButton = computed<boolean>(() => {
  return !(interviewForm.company && interviewForm.vacancyLink && interviewForm.hrName)
})
</script>

<template>
  <div class="page-home">
    <Card>
      <template #title>Новое собеседования</template>
      <template #content>
        <form class="page-home__form" @submit.prevent="addNewInterview(interviewForm)">
          <InputText
            v-model="interviewForm.company"
            class="page-home__input"
            placeholder="Компания"
          />
          <InputText
            v-model="interviewForm.vacancyLink"
            class="page-home__input"
            placeholder="Описание вакансии"
          />
          <InputText
            v-model="interviewForm.hrName"
            class="page-home__input"
            placeholder="Контакт (имя)"
          />
          <InputText
            v-model="interviewForm.contactTelegram"
            class="page-home__input"
            placeholder="Telegram username Hr"
          />
          <InputText
            v-model="interviewForm.contactPhone"
            class="page-home__input"
            placeholder="Телефон HR"
          />
          <Button
            type="submit"
            label="Создать cобеседование"
            class="page-home__button"
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
.page-home {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}
.page-home__input {
  width: 100%;
}
.page-home__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
