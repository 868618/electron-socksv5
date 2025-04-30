import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is, platform } from '@electron-toolkit/utils'
import icon from '@resources/icon.png?asset'

function createWindow(): BrowserWindow {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 350,
    height: 100,

    minWidth: 350,
    maxWidth: 350,
    minHeight: 100,
    show: false,
    autoHideMenuBar: true,
    ...(platform.isLinux ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },

    resizable: true,

    // titleBarStyle: 'customButtonsOnHover'
    titleBarStyle: platform.isMacOS ? 'customButtonsOnHover' : 'hidden'
    // titleBarStyle: 'hidden'
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app
  .whenReady()
  .then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window, { zoom: true, escToCloseWindow: true })
    })

    // IPC test
    ipcMain.on('ping', () => console.log('pong'))

    const mainWindow = createWindow()

    // Test active push message to Renderer-process.
    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow?.webContents.send('main-process-message', new Date().toLocaleString())
    })

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    return mainWindow
  })

  /**
   * 单实例模式
   */
  .then((mainWindow) => {
    const gotTheLock = app.requestSingleInstanceLock()

    if (!gotTheLock) {
      // 已存在实例，退出当前
      app.quit()
    }

    app.on('second-instance', () => {
      if (mainWindow) {
        // 恢复最小化的窗口
        if (mainWindow.isMinimized()) mainWindow.restore()
        // 显示主窗口（如果隐藏）
        mainWindow.show()
        // 聚焦窗口
        mainWindow.focus()
      }
    })

    return mainWindow
  })
  .then((mainWindow) => {
    is.dev && mainWindow.webContents.openDevTools({ mode: 'detach' })
  })

  /**
   * 初始化主进程自定义逻辑
   */
  .then(() => import('./main.handle'))

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
