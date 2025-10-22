<script setup lang="ts">
import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import type { IInterview } from '@/interfaces'
const userStore = useUserStore()
const db = getFirestore()

const interviews = ref<IInterview[]>([])
const isLoading = ref<boolean>(true)

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
    interviews.value = [...listInterviews]
  } catch (e) {
    console.error('Ошибка загрузки собеседований:', e)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="list-page">
    <h1>Список собеседований</h1>
    <DataTable v-if="!isLoading && interviews.length" :value="interviews">
      <Column field="company" header="Компания"></Column>
      <Column field="hrName" header="Имя HR"></Column>
      <Column field="vacancyLink" header="Вакансия">
        <template #body="slotProps">
          <a :href="slotProps.data.vacancyLink" target="_blank">{{ slotProps.data.vacancyLink }}</a>
        </template>
      </Column>
      <Column header="Контакты">
        <template #body="slotProps">
          <div class="contacts">
            <a
              v-if="slotProps.data.contactTelegram"
              :href="`https://t.me/${slotProps.data.contactTelegram}`"
              target="_blank"
              class="contacts__telegram"
            >
              <span class="contacts__icon pi pi-telegram"></span>
            </a>
            <a
              v-if="slotProps.data.contactPhone"
              :href="`tel:${slotProps.data.contactPhone}`"
              target="_blank"
              class="contacts__phone"
            >
              <span class="contacts__icon pi pi-phone"></span>
            </a>
          </div>
        </template>
      </Column>
    </DataTable>
    <p v-else-if="!isLoading">Пока нет собеседований 😔</p>
    <p v-else>Загрузка...</p>
  </div>
</template>
<style scoped>
.list-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}
.contacts {
  display: flex;
  align-items: center;
  gap: 12px;
}
.contacts__telegram {
  color: #0088cc;
}

.contacts__phone {
  color: #371777;
}
.contacts__icon {
  font-size: 20px;
}
</style>
