var path = require('path')
var events = require('events')
var fs = require('fs')

var electron = require('electron')
var app = electron.app
var Tray = electron.Tray
var Menu = electron.Menu
var BrowserWindow = electron.BrowserWindow

var extend = require('extend')
var Positioner = require('electron-positioner')

module.exports = function create (opts) {
  if (typeof opts === 'undefined') opts = {dir: app.getAppPath()}
  if (typeof opts === 'string') opts = {dir: opts}
  if (!opts.dir) opts.dir = app.getAppPath()
  if (!(path.isAbsolute(opts.dir))) opts.dir = path.resolve(opts.dir)
  if (!opts.index) opts.index = 'file://' + path.join(opts.dir, 'index.html')
  if (!opts.windowPosition) opts.windowPosition = (process.platform === 'win32') ? 'trayBottomCenter' : 'trayCenter'
  if (typeof opts.showDockIcon === 'undefined') opts.showDockIcon = false

  // set width/height on opts to be usable before the window is created
  opts.width = opts.width || 400
  opts.height = opts.height || 400
  opts.tooltip = opts.tooltip || ''

  var menubar = new events.EventEmitter()
  menubar.app = app

  if (app.isReady()) appReady()
  else app.on('ready', appReady)

  // Set / get options
  menubar.setOption = function (opt, val) {
    opts[opt] = val
  }

  menubar.getOption = function (opt) {
    return opts[opt]
  }

  return menubar

  function appReady () {
    if (app.dock && !opts.showDockIcon) app.dock.hide()

    var iconPath = opts.icon || path.join(opts.dir, 'IconTemplate.png')
    if (!fs.existsSync(iconPath)) iconPath = path.join(__dirname, '/../assets/icons/', 'IconTemplate.png')

    menubar.tray = opts.tray || new Tray(iconPath)
    menubar.tray.on('click', clicked)
    menubar.tray.on('right-click', rightClicked)
    menubar.tray.on('double-click', clicked)
    menubar.tray.setToolTip(opts.tooltip)
    menubar.showWindow = showWindow
    menubar.emit('ready')

    function clicked (e, bounds) {
      if (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey) return

      showWindow()
    }

    function showWindow () {
      menubar.tray.setHighlightMode('selection')

      menubar.emit('show')

      return
    }

    function rightClicked() {
      menubar.tray.setHighlightMode('always')

      menubar.emit('right-click')

      const contextMenu = Menu.buildFromTemplate([
        {
          label: 'Quit Anota                      ⌘Q',
          role: 'quit',
        },
      ])

      menubar.tray.popUpContextMenu(contextMenu)

      return
    }

    function emitBlur () {
      menubar.emit('focus-lost')
    }
  }
}
