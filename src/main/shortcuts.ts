import localshortcut from 'electron-localshortcut'
import { BrowserWindow } from 'electron'

/**
 * 创建本地快捷键
 * @param win BrowserWindow
 */
export const registerShortcut = (win: BrowserWindow) => {
  localshortcut.register(win, 'Ctrl+w', () => {
    win.hide()
  })
}
