<template>
  <section class="flex h-screen w-screen items-center">
    <div
      class="text-[25px] text-green-200 mx-4 px-[10px] rounded-full inline-flex gap-x-2 h-[40px] select-none items-center justify-center"
      :class="{ 'cursor-pointer': !list.length }"
      @click="handleClick"
    >
      <i v-if="!list.length" class="i-subway:power-batton text-red-700"></i>
      <i v-else class="i-line-md:gauge-loop"></i>
      <span class="text-[12px]" :class="{ 'text-red-700': !list.length }">{{ text }}</span>
    </div>

    <div
      class="text-[12px] inline-flex flex-1 flex-col gap-y-[5px] h-full items-stretch justify-center"
    >
      <div
        v-for="item in list"
        :key="item.port"
        class="text-green-300 underline underline-green-300 underline-offset-5 decoration-dotted grid select-text"
      >
        socks5://{{ item.address }}:{{ item.port }}
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { IpcEmitter } from '@electron-toolkit/typed-ipc/renderer'
import { IpcEvents } from '@src/ipc-events'
import { type ProxyServer } from '@src/ipc-events'
import { ref, watch } from 'vue'

const text = ref<'待启动' | '运行中'>('待启动')

const emitter = new IpcEmitter<IpcEvents>()

const list = ref<ProxyServer[]>([])

const handleClick = async () => {
  if (!list.value.length) {
    const proxyServer = await emitter.invoke('creareSocksV5ProxyServer')
    list.value = proxyServer
  }
}

watch(
  () => list.value,
  (newValue) => {
    if (newValue.length) {
      text.value = '运行中'
    } else {
      text.value = '待启动'
    }
  }
)
</script>
