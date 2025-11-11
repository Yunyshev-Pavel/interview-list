import { ref, computed } from 'vue'
import type { InterviewQuestion } from '@/interfaces'
import { useAppToast } from './useAppToast'

export function useInterviewQuestions() {
  const questions = ref<InterviewQuestion[]>([])
  const { warnToast } = useAppToast()

  const search = ref('')

  const templates = [
    'Расскажите о своем опыте',
    'Какие технологии вы использовали?',
    'Как решаете конфликты в команде?',
    'Что такое СЕО?',
    'В чем разница между == и ===',
  ]

  const isDuplicateQuestion = (text: string): boolean => {
    return questions.value.some((q) => q.text.toLowerCase().trim() === text.toLowerCase().trim())
  }

  const addQuestion = (text: string) => {
    if (!text.trim()) return

    if (isDuplicateQuestion(text)) {
      warnToast('Такой вопрос уже существует!')
      return
    }

    const newQuestion: InterviewQuestion = {
      id: crypto.randomUUID(),
      text,
      isPrepared: false,
      createdAt: new Date(),
      type: 'technical',
      difficulty: 'easy',
    }

    questions.value.push(newQuestion)
  }

  const addFromTemplate = (text: string) => {
    addQuestion(text)
  }

  const removeQuestion = (id: string) => {
    questions.value = questions.value.filter((q) => q.id !== id)
  }

  const togglePrepared = (id: string) => {
    const question = questions.value.find((q) => q.id === id)
    if (question) {
      question.isPrepared = !question.isPrepared
    }
  }

  const filteredQuestions = computed(() => {
    return questions.value.filter((q) => q.text.toLowerCase().includes(search.value.toLowerCase()))
  })

  return {
    questions,
    search,
    templates,
    filteredQuestions,

    addQuestion,
    addFromTemplate,
    removeQuestion,
    togglePrepared,
  }
}
