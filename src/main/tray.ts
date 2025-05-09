import { Tray, Menu, app, BrowserWindow } from 'electron'
import icon from '@resources/icon.png?asset'

/**
 * 创建系统托盘
 * @param win BrowserWindow
 */
export const registerTray = (win: BrowserWindow) => {
  const tray = new Tray(icon)

  const contextMenu = Menu.buildFromTemplate([
    // {
    //   label: '关于',
    //   role: 'about'
    // },
    // { type: 'separator' },
    {
      label: '退出',
      // role: 'quit',
      click() {
        // import.meta.env.VITE_PUB_IS_REAL_QUIT = true
        globalThis.VITE_PUB_IS_REAL_QUIT = true
        // Object.assign(import.meta.env, { VITE_PUB_IS_REAL_QUIT: true })
        app.quit()
      }
    }
  ])

  tray.setContextMenu(contextMenu)

  tray.addListener('click', () => {
    win.show()
  })
}
