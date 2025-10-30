import { useAppToast } from './useAppToast'
import { ref } from 'vue'
import type { IInterview } from '@/interfaces'
import { getFirestore, setDoc, doc } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { PATH } from '@/router/path'

export const useInterview = () => {
  const loading = ref(false)
  const userStore = useUserStore()
  const router = useRouter()
  const db = getFirestore()
  const { errorToast, successToast } = useAppToast()

  const addNewInterview = async (interviewForm: Omit<IInterview, 'id' | 'createdAt'>) => {
    if (!userStore.userId) return
    loading.value = true

    try {
      const id = crypto.randomUUID()
      const payload: IInterview = {
        ...interviewForm,
        id,
        createdAt: new Date(),
      }
      await setDoc(doc(db, `users/${userStore.userId}/interviews`, payload.id), payload)
      successToast('Собеседование успешно создано!')
      router.push(PATH.List)
    } catch (error) {
      errorToast('Ошибка', (error as Error).message)
    } finally {
      loading.value = false
    }
  }

  return {
    addNewInterview,
    loading,
  }
}
