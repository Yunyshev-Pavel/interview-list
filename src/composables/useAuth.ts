import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { ref } from 'vue'
import { useToast } from 'primevue'

const isLoading = ref<boolean>(false)

export function useAuth() {
  const toast = useToast()
  const auth = getAuth()
  const login = async (email: string, password: string) => {
    isLoading.value = true
    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast.add({ severity: 'success', summary: 'Вход', detail: 'Успешный вход', life: 3000 })
      return true
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: (error as Error).message,
          life: 3000,
        })
      }
      return false
    } finally {
      isLoading.value = false
    }
  }

  const register = async (email: string, password: string) => {
    isLoading.value = true
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      toast.add({
        severity: 'success',
        summary: 'Регистрация',
        detail: 'Пользователь создан',
        life: 3000,
      })
      return true
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: (error as Error).message,
          life: 3000,
        })
      }
      return false
    } finally {
      isLoading.value = false
    }
  }
  return { login, register, isLoading }
}
