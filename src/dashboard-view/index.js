import { globalShortcut, BrowserWindow, Menu, ipcMain } from 'electron'

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

  win = new BrowserWindow({
    show: false,
    alwaysOnTop: true,
    width: 690,
    height: isDevMode ? 600 : 400,
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

  const ret = globalShortcut.register('Command+Shift+M', () => {
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
