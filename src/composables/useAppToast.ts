import { useToast } from 'primevue/usetoast'

const lifeToastSeconds = 3000
export const useAppToast = () => {
  const toast = useToast()

  const successToast = (detail: string, summary = 'Успех') => {
    toast.add({
      severity: 'success',
      summary,
      detail,
      life: lifeToastSeconds,
    })
  }

  const errorToast = (detail: string, summary = 'Ошибка') => {
    toast.add({
      severity: 'error',
      summary,
      detail,
      life: lifeToastSeconds,
    })
  }

  const warnToast = (detail: string, summary = 'Предупреждение') => {
    toast.add({
      severity: 'warn',
      summary,
      detail,
      life: lifeToastSeconds,
    })
  }

  const infoToast = (detail: string, summary = 'Инфо') => {
    toast.add({
      severity: 'info',
      summary,
      detail,
      life: lifeToastSeconds,
    })
  }
  return {
    successToast,
    errorToast,
    warnToast,
    infoToast,
  }
}
