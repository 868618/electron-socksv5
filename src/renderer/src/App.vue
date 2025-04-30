<script setup lang="ts">
// import Versions from './components/Versions.vue'
import NetworkInterface from '@components/NetworkInterface.vue'
import TitleBar from '@components/TitleBar.vue'

// const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
</script>

<template>
  <TitleBar></TitleBar>

  <NetworkInterface />
</template>
