<template>
  <!-- <div class="newowrk">network</div> -->

  <!-- <div class="h-[40px] w-[100px] bg-red rounded-full flex justify-center items-center" @click="test">
    network
  </div> -->

  <section class="flex h-screen w-screen items-center">
    <p
      class="text-3 text-teal-400 font-bold mx-4 rounded-full bg-sky-950 inline-grid h-[40px] w-[100px] cursor-pointer select-none shadow-lg place-items-center hover:shadow-cyan-600/50"
      @click="handleClick"
    >
      {{ text }}
    </p>

    <div class="inline-flex flex-1 flex-col h-full items-stretch justify-center">
      <div
        v-for="item in list"
        :key="item.port"
        class="text-green-300 grid select-text place-items-center"
      >
        代理地址 {{ item.address }}:{{ item.port }}
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { IpcEmitter } from '@electron-toolkit/typed-ipc/renderer'
import { IpcEvents } from '@src/ipc-events'
import { type ProxyServer } from '@src/ipc-events'
import { ref, watch } from 'vue'

const text = ref<'启动服务' | '重启服务'>('启动服务')

const emitter = new IpcEmitter<IpcEvents>()

const list = ref<ProxyServer[]>([])

const handleClick = async () => {
  const proxyServer = list.value.length
    ? await emitter.invoke('reloadProxyServer')
    : await emitter.invoke('creareSocksV5ProxyServer')

  list.value = proxyServer
}

watch(
  () => list.value,
  (newValue) => {
    if (newValue.length) {
      text.value = '重启服务'
    } else {
      text.value = '启动服务'
    }
  }
)
</script>
