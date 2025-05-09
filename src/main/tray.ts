import { Tray, Menu, app, BrowserWindow } from 'electron'
import { platform } from '@electron-toolkit/utils'

import win_icon from '@resources/icon.png?asset'
import mac_icon from '@resources/mac_icon.png?asset'

/**
 * 创建系统托盘
 * @param win BrowserWindow
 */
export const registerTray = (win: BrowserWindow) => {
  const tray = new Tray(platform.isMacOS ? mac_icon : win_icon)

  const contextMenu = Menu.buildFromTemplate(
    platform.isWindows
      ? [
          {
            label: '退出',
            click() {
              globalThis.VITE_PUB_IS_REAL_QUIT = true
              app.quit()
            }
          }
        ]
      : []
  )

  tray.setContextMenu(contextMenu)

  tray.addListener('click', () => {
    if (win.isVisible()) {
      // win.hide() // 窗口已显示时点击隐藏
    } else {
      win.show() // 窗口未显示时点击显示
      win.focus() // 确保窗口获取焦点:ml-citation{ref="4" data="citationList"}
    }
  })
}
