import { useConfirm } from 'primevue'
import { useInterview } from '@/composables/useInterviews'
import { deleteDoc, doc, getFirestore } from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import type { Interview } from '@/interfaces'

export function useConfirmInterview() {
  const confirm = useConfirm()
  const { getAllInterviews } = useInterview()
  const userStore = useUserStore()

  const db = getFirestore()

  const confirmRemoveInterview = async (id: string, onUpdate: (list: Interview[]) => void) => {
    confirm.require({
      message: 'Вы хотите удалить собеседования',
      header: 'Удаление собеседования',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Отмена',
      acceptLabel: 'Удалить',
      rejectClass: 'p-button-secondary p-button-outlined',
      acceptClass: 'p-button-danger',
      accept: async () => {
        await deleteDoc(doc(db, `users/${userStore.userId}/interviews`, id))
        const listInterviews = await getAllInterviews()
        onUpdate(listInterviews)
      },
    })
  }
  return { confirmRemoveInterview }
}
