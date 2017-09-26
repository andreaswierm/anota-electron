import Menubar from './utils/menubar'
import { enableLiveReload } from 'electron-compile'
import ClipboardListener from './clipboard-listener'
import ClipboardView from './clipboard-view'
import DashboardView from './dashboard-view'
import storeConfiguration from './redux/configuration'
import * as clipboardActions from './redux/clipboard/actions'
import * as reminderActions from './redux/reminder/actions'
import rimraf from 'rimraf'

const menubar = Menubar({
  alwaysOnTop: true,
  index: `file://${__dirname}/clipboard-view/view/index.html`,
  preloadWindow: true,
})

const isDevMode = process.execPath.match(/[\\/]electron/);
let store

if (isDevMode) enableLiveReload({strategy: 'react-hmr'});

menubar.on('ready', () => {
  store = storeConfiguration(null, 'main')

  store.dispatch(clipboardActions.fetchFromStorege())
  store.dispatch(reminderActions.fetchFromStorege())

  ClipboardListener.init({
    onSave: () => {
      store.dispatch(clipboardActions.fetchFromStorege())
    }
  })

  ClipboardView.init()
  DashboardView.init()
})

menubar.on('show', () => {
  if (ClipboardView.isWindowOpen()) {
    ClipboardView.hide()
  } else {
    ClipboardView.activate()
  }
})

menubar.on('click-clear-history', () => {
  store.dispatch(clipboardActions.clearStorege())
  store.dispatch(reminderActions.clearStorege())

  rimraf(`${__dirname}/assets/application-icons`, (err) => {
    if (err) {
      throw err
    }
  })
})

menubar.app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
})
