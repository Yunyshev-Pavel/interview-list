<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getFirestore, doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'
import type { IInterview, IStage } from '@/interfaces'

import ProgressSpinner from 'primevue/progressspinner'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import Textarea from 'primevue/textarea'
import RadioButton from 'primevue/radiobutton'
import { useUserStore } from '@/stores/user'
import { useRoute, useRouter } from 'vue-router'
import { useAppToast } from '@/composables/useAppToast'

const { warnToast, successToast } = useAppToast()

const userStore = useUserStore()
const db = getFirestore()
const route = useRoute()
const router = useRouter()

const isLoading = ref<boolean>(true)

const interview = ref<IInterview>()

const docref = doc(db, `users/${userStore.userId}/interviews`, route.params.id as string)

const getData = async (): Promise<void> => {
  isLoading.value = true
  const docSnap = await getDoc(docref)

  if (docSnap.exists()) {
    const data = docSnap.data() as IInterview

    if (data.stages && data.stages.length) {
      data.stages = data.stages.map((stage: IStage) => {
        if (stage.date && stage.date instanceof Timestamp) {
          return {
            ...stage,
            date: stage.date?.toDate(),
          }
        }
        return stage
      })
    }

    interview.value = data
  }
  isLoading.value = false
  console.log(interview.value)
}

const addStage = () => {
  if (interview.value) {
    if (!interview.value.stages) {
      interview.value.stages = []
    }
    interview.value.stages.push({ name: '', date: null, description: '' })
  }
}
const removeStage = (index: number) => {
  if (interview.value) {
    if (interview.value.stages) {
      interview.value.stages.splice(index, 1)
    }
  }
}
const saveInterview = async (): Promise<void> => {
  isLoading.value = true

  if (!interview.value) return

  try {
    await updateDoc(docref, { ...interview.value })
    await getData()
    successToast('Сохранено!')

    router.push('/list')
  } catch (e) {
    warnToast('Ошибка', (e as Error).message)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => await getData())
</script>
<template>
  <ProgressSpinner v-if="isLoading" />

  <div class="interview-form" v-else-if="interview?.id && !isLoading">
    <Card>
      <template #title>Собеседование в компанию {{ interview.company }} </template>
      <template #content>
        <div class="interview-form__field">
          <label for="company" class="interview-form__label">Компания</label>
          <InputText class="interview-form__input" id="company" v-model="interview.company" />
        </div>
        <div class="interview-form__field">
          <label for="vacancyLink" class="interview-form__label">Описание Вакансии</label>
          <InputText
            class="interview-form__input"
            id="vacancyLink"
            v-model="interview.vacancyLink"
          />
        </div>
        <div class="interview-form__field">
          <label for="hrName" class="interview-form__label">Контакт (имя)</label>
          <InputText class="interview-form__input" id="hrName" v-model="interview.hrName" />
        </div>
        <div class="interview-form__field">
          <label for="contactTelegram" class="interview-form__label">Telegram HR</label>
          <InputText
            class="interview-form__input"
            id="contactTelegram"
            v-model="interview.contactTelegram"
          />
        </div>
        <div class="interview-form__field">
          <label for="contactPhone" class="interview-form__label">Телефон HR</label>
          <InputText
            class="interview-form__input"
            id="contactPhone"
            v-model="interview.contactPhone"
          />
        </div>

        <div class="interview-form__salary">
          <div class="interview-form__salary-left">
            <InputNumber
              inputId="salaryFrom"
              placeholder="Зарплатная вилка от"
              v-model="interview.salaryFrom"
            />
          </div>
          <div class="interview-form__salary-right">
            <InputNumber
              inputId="salaryTo"
              placeholder="Зарплатная вилка до"
              v-model="interview.salaryTo"
            />
          </div>
        </div>
        <Button
          class="interview-form__add-stage"
          label="Добавить этап"
          severity="info"
          icon="pi pi-plus"
          @click="addStage"
        />
        <template v-if="interview.stages">
          <div
            v-for="(stage, index) in interview.stages"
            :key="index"
            class="interview-form__stage"
          >
            <div class="interview-form__field">
              <label :for="`stage-name-${index}`" class="interview-form__label"
                >Название этапа
              </label>
              <InputText class="interview-form__input" id="stageName" v-model="stage.name" />
            </div>

            <div class="interview-form__field">
              <label :for="`stage-date-${index}`" class="interview-form__label"
                >Дата прохождения этапа
              </label>
              <DatePicker
                class="interview-form__input"
                :id="`stage-date-${index}`"
                dateFormat="dd.mm.yy"
                v-model="stage.date"
              />
            </div>

            <div class="interview-form__field">
              <label :for="`stage-description-${index}`" class="interview-form__label"
                >Комментарий
              </label>
              <Textarea
                :id="`stage-description-${index}`"
                class="interview-form__textarea"
                rows="5"
                v-model="stage.description"
              />
            </div>
            <Button
              class="interview-form__remove-stage"
              severity="danger"
              label="Удалить этап"
              @click="removeStage(index)"
            />
          </div>
        </template>

        <div class="interview-form__result">
          <RadioButton
            inputId="interviewResult1"
            name="result"
            value="Offer"
            v-model="interview.result"
          />
          <label class="interview-form__result-item" for="interviewResult">Оффер</label>
          <RadioButton
            inputId="interviewResult2"
            name="result"
            value="Refusal"
            v-model="interview.result"
          />
          <label class="interview-form__result-item" for="interviewResult">Отказ</label>
        </div>

        <Button
          class="interview-form__submit"
          label="Сохранить"
          icon="pi pi-save"
          @click="saveInterview"
        />
      </template>
    </Card>
  </div>
</template>
<style scoped>
.interview-form {
  max-width: 600px;
  margin: 0 auto;
}
.interview-form__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}
.interview-form__label {
  font-weight: 500;
}
.interview-form__input {
  width: 100%;
}
.interview-form__salary {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}
.interview-form__stage {
  border: 1px solid #d1d1d1;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
}
.interview-form__stage-remove {
  margin-top: 8px;
}
.interview-form__result {
  display: flex;
  gap: 12px;
  margin: 16px 0;
}
.interview-form__add-stage {
  margin: 16px 0;
}
.interview-form__submit {
  margin-top: 20px;
}
</style>
