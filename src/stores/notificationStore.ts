import { ref } from 'vue'
import { defineStore } from 'pinia'

enum SnackbarColor {
  Success = 'success',
  Error = 'error',
}

export const useNotificationStore = defineStore('notification', () => {
  const isSnackbarVisible = ref(false)
  const snackbarColor = ref<SnackbarColor>()
  const resultMessage = ref('')

  const _showResult = (message: string, color: SnackbarColor) => {
    resultMessage.value = message
    snackbarColor.value = color
    isSnackbarVisible.value = true
  }

  const showSuccess = (message: string) => {
    _showResult(message, SnackbarColor.Success)
  }

  const showError = (message: string) => {
    _showResult(message, SnackbarColor.Error)
  }

  return {
    // state
    isSnackbarVisible,
    snackbarColor,
    resultMessage,
    // actions
    showSuccess,
    showError,
  }
})
