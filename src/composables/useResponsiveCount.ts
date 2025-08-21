import { computed } from 'vue'
import { useDisplay } from 'vuetify'

const defaultConfig = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 4,
  xxl: 4,
}

export const useResponsiveCount = (configOverrides = {}) => {
  const { name } = useDisplay()

  const finalConfig = { ...defaultConfig, ...configOverrides }

  const count = computed(() => {
    return finalConfig[name.value] ?? defaultConfig.xs
  })

  return { count }
}
