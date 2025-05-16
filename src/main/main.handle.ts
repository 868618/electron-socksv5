import { IpcListener } from '@electron-toolkit/typed-ipc/main'
import { IpcEvents } from '@src/ipc-events'
import os from 'os'
import socks from 'socksv5'
import { ProxyServer } from '@src/ipc-events'
import { detect } from 'detect-port'
import getPort from 'get-port'
import { Notification } from 'electron'

import { platform } from '@electron-toolkit/utils'

import win_icon from '@resources/icon.png?asset'
import mac_icon from '@resources/mac_icon.png?asset'

const ipc = new IpcListener<IpcEvents>()

const proxyServerStore: (ProxyServer & { server: unknown })[] = []

const getNetworkInterfaces = () => {
  const networks = Object.entries(os.networkInterfaces())
    .map(([k, v]) => v?.map((i) => ({ ...i, name: k })))
    .flat()
    .filter((i) => i && i.family === 'IPv4' && i.address !== '127.0.0.1')

  return networks as (os.NetworkInterfaceInfoIPv4 & { name: string })[]
}

ipc.handle('getNetworkInterfaces', () => getNetworkInterfaces())

const creareSocksV5ProxyServer = async () => {
  const networks = getNetworkInterfaces()

  for (const network of networks) {
    const { resolve, promise } = Promise.withResolvers()

    const port = await getPort()

    const srv = socks.createServer(function (info, accept) {
      console.log('info: ', info)
      accept()
    })

    const { address, name } = network

    srv.listen(port, address, function () {
      proxyServerStore.push({
        address,
        port,
        name,
        server: srv
      })

      resolve(null)
    })

    srv.useAuth(socks.auth.None())

    await promise
  }

  // console.log('proxyServerStore: ---', proxyServerStore)

  return proxyServerStore.map(({ port, address, name }) => ({ port, address, name }))
}

ipc.handle('creareSocksV5ProxyServer', creareSocksV5ProxyServer)

ipc.handle('reloadProxyServer', async () => {
  await Promise.all(
    proxyServerStore.map((i) => {
      return detect(i.port).then((realPort) => {
        if (realPort != i.port) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(i.server as any).close()
        }
      })
    })
  )

  proxyServerStore.length = 0

  return creareSocksV5ProxyServer()
})

ipc.handle('alert', (_e, text: string) => {
  const isSupportedNotification = Notification.isSupported()
  // console.log('isSupportedNotification: ', isSupportedNotification)

  if (isSupportedNotification) {
    const notification = new Notification({
      title: '',
      body: text,
      icon: platform.isMacOS ? mac_icon : win_icon,
      urgency: 'low'
    })

    notification.show()
  }

  // dialog.showMessageBox({
  //   title: '学道代理',
  //   message: text,
  //   type: 'info'
  // })
})
