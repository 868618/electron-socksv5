import localshortcut from 'electron-localshortcut'
import { BrowserWindow, app } from 'electron'
import { platform } from '@electron-toolkit/utils'

/**
 * 创建本地快捷键
 * @param win BrowserWindow
 *
 * @description
 *
 * - Ctrl+w 隐藏窗口
 * - Ctrl+y 切换控制台
 */
export const registerShortcut = (win: BrowserWindow) => {
  if (platform.isWindows) {
    localshortcut.register(win, ['Ctrl+W'], () => {
      win.hide()
    })

    localshortcut.register(win, 'Ctrl+Q', () => {
      console.log('Ctrl+Q: ')
      app.quit()
    })
  }

  localshortcut.register(win, 'Ctrl+Y', () => {
    win.webContents.toggleDevTools()
  })
}
