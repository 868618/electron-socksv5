import './assets/main.css'
import 'virtual:uno.css'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App)
  .mount('#app')
  .$nextTick(() => {
    // Use contextBridge
    window.electron.ipcRenderer.on('main-process-message', (_event, message) => {
      console.log(message)
    })
  })
