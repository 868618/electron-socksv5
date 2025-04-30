import { IpcListener } from '@electron-toolkit/typed-ipc/main'
import { IpcEvents } from '@src/ipc-events'
import os from 'os'
import socks from 'socksv5'
import { ProxyServer } from '@src/ipc-events'
import { detect } from 'detect-port'
import getPort from 'get-port'

const ipc = new IpcListener<IpcEvents>()

const proxyServerStore: (ProxyServer & { server: unknown })[] = []

const getNetworkInterfaces = (): os.NetworkInterfaceInfo[] => {
  const networks = [...Object.values(os.networkInterfaces())]
    .flat()
    .filter(Boolean)
    .filter((i) => i?.family === 'IPv4')
    .filter((i) => i?.address !== '127.0.0.1')

  return networks
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

    const { address } = network

    srv.listen(port, address, function () {
      proxyServerStore.push({
        address,
        port,
        server: srv
      })

      resolve(null)
    })

    srv.useAuth(socks.auth.None())

    await promise
  }

  // console.log('proxyServerStore: ---', proxyServerStore)

  return proxyServerStore.map(({ port, address }) => ({ port, address }))
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
