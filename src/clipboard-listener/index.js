import { clipboard, ipcMain, nativeImage, app } from 'electron'
import Storage from './../utils/storage'
import ClipboardWatcher from 'electron-clipboard-watcher'
import format from 'date-fns/format'
import { ObjectID } from 'mongodb'
import activeWin from 'active-win'
import { Map } from 'immutable'

let clipboardWatcher
let onSaveCallback

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