import Storage from './../../utils/storage'
import { Map } from 'immutable'
import { ObjectID } from 'mongodb'
import format from 'date-fns/format'

import {
  ON_FETCH_FROM_STORAGE,
  ON_CLEAR_STORAGE
} from './constants'

export const create = ({ value }) => dispatch => {
  const newReminder = {
    id: new ObjectID(),
    doneAt: null,
    createdAt: format(new Date()),
    updatedAt: format(new Date()),
    value,
  }

  return Storage
    .get()
    .then(state => state.setIn(['reminders', newReminder.id], newReminder))
    .then(Storage.save)
    .then(state => {
      dispatch({
        type: ON_FETCH_FROM_STORAGE,
        payload: state.get('reminders', Map()).toJS(),
      })
    })
}

export const update = reminder => dispatch => {
  return Storage
    .get()
    .then(state => state.setIn(['reminders', reminder.id], reminder))
    .then(Storage.save)
    .then(state => {
      dispatch({
        type: ON_FETCH_FROM_STORAGE,
        payload: state.get('reminders', Map()).toJS(),
      })
    })
}

export const fetchFromStorege = () => dispatch => {
  return Storage.get().then((state) => {
    dispatch({
      type: ON_FETCH_FROM_STORAGE,
      payload: state.get('reminders', Map()).toJS(),
    })
  })
}


export const clearStorege = () => dispatch => {
  return Storage.clear().then(() => {
    dispatch({ type: ON_CLEAR_STORAGE })
  })
}

export const setDone = (reminder, isDone) => dispatch => {
  if (isDone) {
    reminder.doneAt = format(new Date())
  } else {
    reminder.doneAt = null
  }

  return dispatch(update(reminder))
}
