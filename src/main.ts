import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import { vuetifyConfig } from './stylesheets/theme'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import App from './App.vue'
import router from './router'
import '@mdi/font/css/materialdesignicons.css'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(
  createVuetify({
    ...vuetifyConfig,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
  }),
)

app.mount('#app')
