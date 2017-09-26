import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { electronEnhancer } from 'redux-electron-store'
import { hashHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import { routerReducer as routing } from 'react-router-redux'

import {
  clipboard,
  reminder,
} from './'

export default function configureStore(initialState = {}, scope = 'main') {
  const router = routerMiddleware(hashHistory)

  let reducers = {
    [clipboard.NAME]: clipboard.reducer,
    [reminder.NAME]: reminder.reducer,
  }

  let middleware = [
    thunk,
  ];

  if (scope === 'renderer') {
    middleware = [
      router,
      ...middleware,
    ];

    reducers = {
      ...reducers,
      routing,
    };
  }

  const enhanced = [
    applyMiddleware(...middleware),
    electronEnhancer({
      dispatchProxy: a => store.dispatch(a),
    })
  ];

  const rootReducer = combineReducers(reducers);
  const enhancer = compose(...enhanced);
  const store = createStore(rootReducer, enhancer);

  return store;
}
