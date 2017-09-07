import Menubar from './utils/menubar'
import { enableLiveReload } from 'electron-compile'
import Clipboard from './clipboard'
import ClipboardView from './clipboard-view'
import storeConfiguration from './redux/configuration'
import * as clipboardActions from './redux/clipboard/actions'

const menubar = Menubar({
  alwaysOnTop: true,
  index: `file://${__dirname}/clipboard-view/view/index.html`,
  preloadWindow: true,
})

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) enableLiveReload({strategy: 'react-hmr'});

menubar.on('ready', () => {
  const store = storeConfiguration(null, 'main')

  store.dispatch(clipboardActions.fetchFromStorege())

  Clipboard.init({
    onSave: () => {
      store.dispatch(clipboardActions.fetchFromStorege())
    }
  })

  ClipboardView.init()
})

menubar.on('show', () => {
  if (ClipboardView.isWindowOpen()) {
    ClipboardView.hide()
  } else {
    ClipboardView.activate()
  }
})

menubar.app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
})
