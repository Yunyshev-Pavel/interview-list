<script setup lang="ts">
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from 'firebase/firestore'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useConfirm } from 'primevue'
import type { IInterview } from '@/interfaces'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import Badge from 'primevue/badge'

const userStore = useUserStore()
const db = getFirestore()
const confirm = useConfirm()

const interviews = ref<IInterview[]>([])
const isLoading = ref<boolean>(true)

const confirmRemoveInterview = async (id: string): Promise<void> => {
  confirm.require({
    message: 'Вы хотите удалить собеседования',
    header: 'Удаление собеседования',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Отмена',
    acceptLabel: 'Удалить',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        isLoading.value = true
        await deleteDoc(doc(db, `users/${userStore.userId}/interviews`, id))
        const listInterviews = await getAllInterviews()
        interviews.value = listInterviews
      } finally {
        isLoading.value = false
      }
    },
  })
}

const getAllInterviews = async (): Promise<IInterview[]> => {
  const getData = query(
    collection(db, `users/${userStore.userId}/interviews`),
    orderBy('createdAt', 'desc'),
  )
  const listDocs = await getDocs(getData)
  return listDocs.docs.map((doc) => doc.data() as IInterview)
}

onMounted(async () => {
  try {
    const listInterviews = await getAllInterviews()
    interviews.value = listInterviews
  } catch (e) {
    console.error('Ошибка загрузки собеседований:', e)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <ConfirmDialog />
  <ProgressSpinner v-if="isLoading" />
  <Message v-else-if="!interviews.length" size="large" severity="secondary"
    >Пока нет собеседований ! 😔</Message
  >
  <div v-else class="list-page">
    <h1>Список собеседований</h1>
    <DataTable v-if="!isLoading && interviews.length" :value="interviews">
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
          <span v-if="!slotProps.data.stages">Не заполнена</span>
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
              @click="confirmRemoveInterview(slotProps.data.id)"
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
