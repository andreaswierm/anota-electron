import { fromJS } from 'immutable'
import _ from 'lodash'

import {
  ON_CLEAR_STORAGE,
  ON_FETCH_FROM_STORAGE,
} from './constants'

const initialState = {
  collection: {},
  doneCollection: {},
}

const reducers = {
  [ON_FETCH_FROM_STORAGE]: (state, action) => {
    const reminders = _.reduce(action.payload.reminders, (result, reminderItem) => {
      const reminder = reminderItem

      result[reminder.id] = reminder

      return result
    }, {})

    const doneReminders = _.reduce(action.payload.doneReminders, (result, reminderItem) => {
      const reminder = reminderItem

      result[reminder.id] = reminder

      return result
    }, {})

    return {
      ...state,
      doneCollection: {
        ...state.doneCollection,
        ...doneReminders,
      },
      collection: {
        ...state.collection,
        ...reminders,
      },
    };
  },

  [ON_CLEAR_STORAGE]: (state) => {
    return {
      ...state,
      collection: {},
    };
  }
}

export default (state = initialState, action) => {
  const reducer = reducers[action.type];

  if (reducer) {
    return reducer(state, action);
  }

  return state;
};
