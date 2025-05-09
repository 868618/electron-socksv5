import localshortcut from 'electron-localshortcut'
import { BrowserWindow } from 'electron'

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
  localshortcut.register(win, 'Ctrl+w', () => {
    win.hide()
  })

  localshortcut.register(win, 'Ctrl+y', () => {
    win.webContents.toggleDevTools()
  })
}
