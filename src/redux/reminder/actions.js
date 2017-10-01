import Storage from './../../utils/storage'
import { Map, List, fromJS } from 'immutable'
import format from 'date-fns/format'
import _ from 'lodash'
import differenceInDays from 'date-fns/difference_in_days'

import {
  ON_FETCH_FROM_STORAGE,
  ON_CLEAR_STORAGE
} from './constants'

export const createState = (payload) => dispatch => {
  const newRemindersState = fromJS(payload).filter(reminder => !!reminder.get('content').length)

  return Storage
    .get()
    .then(state => {
      return state
        .set('reminders', newRemindersState.filter(reminder => {
          return !(
            reminder.get('isDone', false) &&
            Math.abs(differenceInDays(new Date(), new Date(reminder.get('doneAt', null)))) !== 0
          )
        }))
        .merge({
          doneReminders: state.get('doneReminders', List()).concat(newRemindersState.filter(reminder => {
            return (
              reminder.get('isDone', false) &&
              Math.abs(differenceInDays(new Date(), new Date(reminder.get('doneAt', null)))) !== 0
            )
          }))
        })
    })
    .then(Storage.save)
    .then(state => {
      dispatch({ type: ON_CLEAR_STORAGE })
      dispatch({
        type: ON_FETCH_FROM_STORAGE,
        payload: {
          reminders: state.get('reminders', List()).toJS(),
          doneReminders: state.get('doneReminders', List()).toJS(),
        },
      })
    })
}

export const fetchFromStorege = () => dispatch => {
  return Storage.get().then((state) => {
    dispatch({
      type: ON_FETCH_FROM_STORAGE,
      payload: {
        reminders: state.get('reminders', List()).toJS(),
        doneReminders: state.get('doneReminders', List()).toJS(),
      },
    })
  })
}

export const clearStorege = () => dispatch => {
  return Storage.clear().then(() => {
    dispatch({ type: ON_CLEAR_STORAGE })
  })
}

