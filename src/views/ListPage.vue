<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Interview } from '@/interfaces'
import { useInterview } from '@/composables/useInterviews'
import { useAppToast } from '@/composables/useAppToast'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import Badge from 'primevue/badge'
const { warnToast } = useAppToast()

const { getAllInterviews, loading, confirmRemoveInterview } = useInterview()

const interviews = ref<Interview[]>([])

const removeInterview = async (id: string) => {
  confirmRemoveInterview(id, (list) => {
    interviews.value = list
  })
}

onMounted(async () => {
  try {
    loading.value = true
    const listInterviews = await getAllInterviews()
    interviews.value = listInterviews
  } catch (e) {
    warnToast('Ошибка загрузки собеседований:', (e as Error).message)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <ConfirmDialog />
  <ProgressSpinner v-if="loading" />
  <Message v-else-if="!interviews.length" size="large" severity="secondary"
    >Пока нет собеседований ! 😔</Message
  >
  <div v-else class="list-page">
    <h1>Список собеседований</h1>
    <DataTable v-if="!loading && interviews.length" :value="interviews">
      <Column field="company" header="Компания"></Column>
      <Column field="hrName" header="Имя HR"></Column>
      <Column field="vacancyLink" header="Вакансия">
        <template #body="slotProps">
          <a :href="slotProps.data.vacancyLink" target="_blank">Ссылка на вакансию</a>
        </template>
      </Column>
      <Column header="Контакты">
        <template #body="slotProps">
          <div class="list-page__contacts">
            <a
              v-if="slotProps.data.contactTelegram"
              :href="`https://t.me/${slotProps.data.contactTelegram}`"
              target="_blank"
              class="list-page__contacts__telegram"
            >
              <span class="list-page__contacts__icon pi pi-telegram"></span>
            </a>
            <a
              v-if="slotProps.data.contactPhone"
              :href="`tel:${slotProps.data.contactPhone}`"
              target="_blank"
              class="list-page__contacts__phone"
            >
              <span class="list-page__contacts__icon pi pi-phone"></span>
            </a>
          </div>
        </template>
      </Column>
      <Column header="Этапы">
        <template #body="slotProps">
          <span v-if="!slotProps.data.stages">Не заполнено</span>
          <div v-else class="list-page__stages">
            <Badge
              v-for="(stage, i) in slotProps.data.stages"
              :key="i"
              :value="i + 1"
              rounded
              v-tooltip.top="stage.name"
            />
          </div>
        </template>
      </Column>

      <Column header="Зарплатная вилка">
        <template #body="slotProps">
          <span v-if="!slotProps.data.salaryFrom">Не заполнена</span>
          <span v-else>{{ slotProps.data.salaryFrom }} - {{ slotProps.data.salaryTo }}</span>
        </template>
      </Column>
      <Column header="Результат">
        <template #body="slotProps">
          <template v-if="slotProps.data.result">
            <Badge
              :severity="slotProps.data.result === 'Offer' ? 'success' : 'danger'"
              :value="slotProps.data.result === 'Offer' ? 'Оффер' : 'Отказ'"
            />
          </template>
          <span v-else>Не указано</span>
        </template>
      </Column>

      <Column>
        <template #body="slotProps">
          <div class="list-page__actions">
            <router-link :to="`/interview/${slotProps.data.id}`">
              <Button icon="pi pi-pencil" severity="info"></Button>
            </router-link>
            <Button
              icon="pi pi-trash"
              severity="danger"
              @click="removeInterview(slotProps.data.id)"
            ></Button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
<style scoped>
.list-page {
  margin: 0 auto;
  padding: 2rem;
}
.list-page__contacts {
  display: flex;
  align-items: center;
  gap: 12px;
}
.list-page__actions {
  display: flex;
  gap: 8px;
  align-items: center;
}
.list-page__contacts__telegram {
  color: #0088cc;
}

.list-page__contacts__phone {
  color: #371777;
}
.list-page__contacts__icon {
  font-size: 20px;
}
</style>
