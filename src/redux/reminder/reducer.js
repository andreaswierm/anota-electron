import { fromJS } from 'immutable'
import _ from 'lodash'

import {
  ON_CLEAR_STORAGE,
  ON_FETCH_FROM_STORAGE,
} from './constants'

const initialState = {
  collection: {},
}

const reducers = {
  [ON_FETCH_FROM_STORAGE]: (state, action) => {
    const newCollection = _.reduce(action.payload, (result, reminderItem) => {
      const reminder = reminderItem

      result[reminder.id] = reminder

      return result
    }, {})

    return {
      ...state,
      collection: {
        ...state.collection,
        ...newCollection,
      }
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
