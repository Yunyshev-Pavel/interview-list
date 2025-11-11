import { useAppToast } from './useAppToast'
import { ref } from 'vue'
import type { Interview, IStage } from '@/interfaces'
import {
  getFirestore,
  setDoc,
  doc,
  collection,
  orderBy,
  query,
  getDocs,
  getDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import { PATH } from '@/router/path'
import { useRoute, useRouter } from 'vue-router'

export const useInterview = () => {
  const interview = ref<Interview | null>(null)
  const loading = ref(false)

  const userStore = useUserStore()
  const router = useRouter()
  const route = useRoute()

  const { errorToast, successToast, warnToast } = useAppToast()

  const db = getFirestore()
  const getDocRef = (id: string) => doc(db, `users/${userStore.userId}/interviews`, id)

  const getAllInterviews = async (): Promise<Interview[]> => {
    const getDataQuery = query(
      collection(db, `users/${userStore.userId}/interviews`),
      orderBy('createdAt', 'desc'),
    )
    const listDocs = await getDocs(getDataQuery)
    return listDocs.docs.map((doc) => doc.data() as Interview)
  }

  const addNewInterview = async (interviewForm: Omit<Interview, 'id' | 'createdAt'>) => {
    if (!userStore.userId) return
    loading.value = true
    try {
      const id = crypto.randomUUID()
      const payload: Interview = {
        ...interviewForm,
        id,
        createdAt: new Date(),
      }
      await setDoc(doc(db, `users/${userStore.userId}/interviews`, payload.id), payload)
      successToast('Собеседование успешно создано!')
      router.push(PATH.LIST)
    } catch (error) {
      errorToast('Ошибка', (error as Error).message)
    } finally {
      loading.value = false
    }
  }

  const normalizeInterview = (data: Interview): Interview => {
    if (!data.stages) return data
    return {
      ...data,
      stages: data.stages.map((stage: IStage) => ({
        ...stage,
        date: stage.date instanceof Timestamp ? stage.date.toDate() : stage.date,
      })),
    }
  }

  const getData = async (): Promise<void> => {
    loading.value = true
    try {
      const docSnap = await getDoc(getDocRef(route.params.id as string))
      if (docSnap.exists()) {
        interview.value = normalizeInterview(docSnap.data() as Interview)
      }
    } finally {
      loading.value = false
    }
  }

  const saveInterview = async (): Promise<void> => {
    if (!interview.value) return
    loading.value = true
    try {
      await updateDoc(getDocRef(interview.value.id), { ...interview.value })
      successToast('Сохранено!')
      router.push(PATH.LIST)
    } catch (e) {
      warnToast('Ошибка', (e as Error).message)
    } finally {
      loading.value = false
    }
  }

  return {
    addNewInterview,
    getAllInterviews,
    saveInterview,
    getData,
    loading,
    interview,
  }
}
