import { useToast } from 'primevue/usetoast'

export const useAppToast = () => {
  const toast = useToast()

  const successToast = (detail: string, summary = 'Успех') => {
    toast.add({
      severity: 'success',
      summary,
      detail,
      life: 3000,
    })
  }

  const errorToast = (detail: string, summary = 'Ошибка') => {
    toast.add({
      severity: 'error',
      summary,
      detail,
      life: 3000,
    })
  }

  const warnToast = (detail: string, summary = 'Предупреждение') => {
    toast.add({
      severity: 'warn',
      summary,
      detail,
      life: 3000,
    })
  }

  const infoToast = (detail: string, summary = 'Инфо') => {
    toast.add({
      severity: 'info',
      summary,
      detail,
      life: 3000,
    })
  }
  return {
    successToast,
    errorToast,
    warnToast,
    infoToast,
  }
}
