import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { ref } from 'vue'
import { useAppToast } from './useAppToast'

export function useAuth() {
  const { successToast, errorToast } = useAppToast()

  const isLoading = ref<boolean>(false)
  const auth = getAuth()

  const login = async (email: string, password: string) => {
    isLoading.value = true
    try {
      await signInWithEmailAndPassword(auth, email, password)
      successToast('Вход', 'Успешный вход')
      return true
    } catch (error: unknown) {
      if (error instanceof Error) {
        errorToast('Ошибка', error.message)
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
      successToast('Регистрация', 'Пользователь создан')
      return true
    } catch (error: unknown) {
      if (error instanceof Error) {
        errorToast('Ошибка', error.message)
      }
      return false
    } finally {
      isLoading.value = false
    }
  }
  return { login, register, isLoading }
}
