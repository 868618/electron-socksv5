import electronLocalshortcut from 'electron-localshortcut'
import { BrowserWindow } from 'electron'

export default (win: BrowserWindow) => {
  electronLocalshortcut.register(win, 'Ctrl+w', () => {
    console.log('You pressed ctrl & w')

    win.hide()
  })
}
