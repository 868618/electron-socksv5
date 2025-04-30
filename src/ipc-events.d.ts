export type ProxyServer = { address: string; port: number; name: string }

// Main process ipc events
export type IpcEvents =
  | {
      ping: [string] // listener event map
    }
  | {
      getNetworkInterfaces: () => os.NetworkInterfaceInfo[] // handler event map

      creareSocksV5ProxyServer: () => ProxyServer[] // handler event map

      /**
       * 重启所有代理服务
       * @returns
       */
      reloadProxyServer: () => ProxyServer[]
    }

//Renderer ipc events
export type IpcRendererEvent = {
  ready: [boolean]
}
