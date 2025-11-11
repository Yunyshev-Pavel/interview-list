<script setup lang="ts">
import { ref } from 'vue'
import { useInterviewQuestions } from '@/composables/useInterviewQuestions'

import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Checkbox from 'primevue/checkbox'

const {
  questions,
  templates,
  search,
  filteredQuestions,
  addQuestion,
  addFromTemplate,
  removeQuestion,
  togglePrepared,
} = useInterviewQuestions()

const customQuestion = ref('')

const onAddCustom = () => {
  if (!customQuestion.value.trim()) return
  addQuestion(customQuestion.value)
  customQuestion.value = ''
}
</script>

<template>
  <div class="questions-page">
    <Card>
      <template #title>
        <span>Вопросы для подготовки к собеседованиям</span>
      </template>

      <template #content>
        <div class="questions-page__search">
          <InputText v-model="search" placeholder="Поиск по вопросам..." />
        </div>

        <div class="questions-page__add">
          <h4>Добавить вопросы</h4>

          <div class="questions-page__templates">
            <div
              v-for="(template, index) in templates"
              :key="index"
              class="questions-page__template"
            >
              <span>{{ template }}</span>
              <Button icon="pi pi-plus" @click="addFromTemplate(template)" />
            </div>
          </div>

          <div class="questions-page__custom">
            <h4>Добавить свой вопрос</h4>
            <div class="questions-page__custom-inputs">
              <InputText
                v-model="customQuestion"
                placeholder="Введите свой вопрос..."
                @keyup.enter="onAddCustom"
              />
              <Button
                label="Добавить"
                icon="pi pi-plus"
                @click="onAddCustom"
                :disabled="!customQuestion.trim()"
              />
            </div>
          </div>
        </div>

        <div class="questions-page__list">
          <h4>Мои вопросы ({{ questions.length }})</h4>

          <div v-if="filteredQuestions.length === 0" class="questions-page__empty">
            <i class="pi pi-inbox" style="font-size: 2rem"></i>
            <p>Нет вопросов</p>
          </div>

          <div v-else>
            <div
              v-for="question in filteredQuestions"
              :key="question.id"
              class="questions-page__item"
            >
              <div class="questions-page__item-main">
                <Checkbox
                  v-model="question.isPrepared"
                  :binary="true"
                  @change="togglePrepared(question.id)"
                />

                <span
                  class="questions-page__item-text"
                  :class="{ 'questions-page__item-text--prepared': question.isPrepared }"
                >
                  {{ question.text }}
                </span>

                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  @click="removeQuestion(question.id)"
                />
              </div>

              <Textarea
                v-if="question.isPrepared"
                v-model="question.answer"
                placeholder="Ваш ответ..."
                rows="3"
                class="questions-page__item-answer"
              />
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.questions-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  font-family: sans-serif;
}
.questions-page__search {
  margin-bottom: 1rem;
}
.questions-page__add {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}
.questions-page__templates {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}
.questions-page__template {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  transition: background-color 0.2s;
}
.questions-page__custom {
  border-top: 1px;
  padding-top: 1rem;
}
.questions-page__custom h4 {
  margin-bottom: 0.75rem;
  color: #374151;
  font-weight: 600;
}

.questions-page__custom-inputs {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.questions-page__list {
  margin-top: 2rem;
}
.questions-page__empty {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}
.questions-page__item {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
}
.questions-page__item-main {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.questions-page__item-text {
  flex: 1;
}
.questions-page__item-text--prepared {
  text-decoration: line-through;
  color: #6b7280;
}

.questions-page__item-answer {
  width: 100%;
  margin-top: 0.5rem;
  resize: vertical;
}
</style>
