import os from 'os'
import storage from 'electron-json-storage'
import { fromJS } from 'immutable'

storage.setDataPath(os.tmpdir());

const STATE_KEY = 'ANOTA'

const getState = () => {
  return new Promise((resolve, reject) => {
    storage.get(STATE_KEY, (error, state) => {
      resolve(fromJS(state || {}))
    })
  })
}

const saveState = state => {
  return new Promise((resolve, reject) => {
    storage.set(STATE_KEY, state.toJS(), (error) => {
      if (error) throw error;

      getState().then((state) => {
        resolve(state)
      })
    });
  })
}

const get = () => {
  return getState()
}

const save = (state) => {
  return saveState(state)
}

const clear = () => {
  storage.clear((err) => {
    if (err) {
      throw err
    }
  })
}

export default {
  get,
  save,
  clear,
}
