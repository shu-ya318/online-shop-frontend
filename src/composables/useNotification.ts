import { ref } from 'vue'

const showSnackbar = ref<boolean>(false)
const snackbarColor = ref<'success' | 'error'>()
const resultMessage = ref<string>('')

export const useNotification = () => {
  const _showResult = (message: string, color: 'success' | 'error') => {
    resultMessage.value = message
    snackbarColor.value = color
    showSnackbar.value = true
  }

  const showSuccess = (message: string) => {
    _showResult(message, 'success')
  }

  const showError = (message: string) => {
    _showResult(message, 'error')
  }

  return {
    showSnackbar,
    snackbarColor,
    resultMessage,
    showSuccess,
    showError,
  }
}
