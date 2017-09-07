import Electron, { globalShortcut, BrowserWindow, Menu, ipcMain } from 'electron'

const isDevMode = process.execPath.match(/[\\/]electron/);

let win
let isVisible = false

const hideWindow = () => {
  if (!win) {
    return
  }

  win.hide()
  isVisible = false
  Menu.sendActionToFirstResponder('hide:')
}

const showWindow = () => {
  win.show()
  isVisible = true
}

const createWindow = () => {
  if (win) {
    return
  }

  const { height } = Electron.screen.getPrimaryDisplay().workAreaSize

  win = new BrowserWindow({
    show: false,
    alwaysOnTop: true,
    y: 30,
    x: 10,
    width: isDevMode ? 460 : 320,
    height:
    height - 20,
    titleBarStyle: 'hidden',
    maximizable: false,
    minimizable: false,
    hasShadow: true,
  })

  win.loadURL(`file://${__dirname}/view/index.html`)
  win.on('blur', hideWindow)

  if (isDevMode) {
    win.webContents.openDevTools({ mode: 'bottom' });
  }

  win.on('close', () => {
    isVisible = false
    win = null
    Menu.sendActionToFirstResponder('hide:')
  })
}

const init = () => {
  createWindow()

  const ret = globalShortcut.register('Command+Shift+V', () => {
    if (isVisible) {
      hideWindow()
    } else {
      createWindow()
      showWindow()
    }
  })

  ipcMain.on('onHideClipboardView', () => {
    hideWindow()
  })
}

const activate = () => {
  createWindow()
  showWindow()
}

const isWindowOpen = () => {
  return isVisible
}

export default {
  init,
  activate,
  isWindowOpen,
  hide: hideWindow,
}
