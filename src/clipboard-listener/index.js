import $ from 'nodobjc'
import path from 'path'
import activeWin from 'active-win'
import ClipboardWatcher from 'electron-clipboard-watcher'
import format from 'date-fns/format'
import Storage from './../utils/storage'
import { clipboard, ipcMain, nativeImage } from 'electron'
import { kebabCase } from 'lodash'
import { Map } from 'immutable'
import fs from 'fs'
import { ObjectID } from 'mongodb'

let clipboardWatcher
let onSaveCallback

$.framework('Foundation')
$.framework('AppKit')

const saveRecord = async (record) => {
  const state = await Storage.get()

  const clipAlreadySaved = state.get('clips', Map()).filter(clip => {
    return clip.getIn(['payload', 'text']) === record.payload.text
  }).first()

  if (clipAlreadySaved) {
    record = {
      ...clipAlreadySaved.toJS(),
      updatedAt: format(new Date()),
    }
  }

  await Storage.save(state.setIn(['clips', record.id], record))

  if (onSaveCallback) {
    onSaveCallback()
  }
}

const buildRecord = async ({
  text
}) => {
  const activeWindowInfo = await activeWin()

  const bundleIdentifier =
    $.NSWorkspace
      ('sharedWorkspace')
      ('runningApplications')
      (
        'filteredArrayUsingPredicate',
        $.NSPredicate('predicateWithFormat', $('active == YES'))
      )
      ('objectAtIndex', 0)
      ('bundleIdentifier');

  const appPath =
    $.NSWorkspace
      ('sharedWorkspace')
      (
        'absolutePathForAppBundleWithIdentifier',
        bundleIdentifier
      );

  const icon =
    $.NSWorkspace
      ('sharedWorkspace')
      (
        'iconForFile',
        appPath
      );

  const iconPathBase = path.normalize(`${__dirname}/../assets/application-icons`)

  if (!fs.existsSync(iconPathBase)){
    fs.mkdirSync(iconPathBase);
  }

  const iconPath = `${iconPathBase}/${kebabCase(activeWindowInfo.app)}.png`
  const cgRef = icon('CGImageForProposedRect', null, 'context', null, 'hints', null)
  const newRep = $.NSBitmapImageRep('alloc')('initWithCGImage', cgRef)
  const pngData = newRep('representationUsingType', $.NSPNGFileType, 'properties', null)
  const didSave = pngData('writeToFile', $.NSString('stringWithUTF8String', iconPath), 'atomically', true)
  newRep('autorelease')

  let savedImage = nativeImage.createFromPath(iconPath)
  savedImage = savedImage.resize({ width: 128, height: 128 })

  fs.writeFileSync(iconPath, savedImage.toPNG())

  return {
    id: new ObjectID(),
    createdAt: format(new Date()),
    updatedAt: format(new Date()),
    isFavorite: false,
    payload: {
      text,
    },
    application: {
      name: activeWindowInfo.app,
      title: activeWindowInfo.title,
      iconPath: didSave ? iconPath : null
    }
  }
}

const init = async (options = {}) => {
  onSaveCallback = options.onSave

  clipboardWatcher = ClipboardWatcher({
    watchDelay: 100,
    onTextChange: async (text) => {
      const record = await buildRecord({ text })

      saveRecord(record)
    }
  })
}

export default {
  init,
}
