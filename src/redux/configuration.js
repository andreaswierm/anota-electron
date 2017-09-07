import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { electronEnhancer } from 'redux-electron-store'

import {
  clipboard,
} from './'

export default function configureStore(initialState = {}, scope = 'main') {
  let reducers = {
    [clipboard.NAME]: clipboard.reducer,
  }

  let middleware = [
    thunk,
  ];

  if (scope === 'renderer') {
    middleware = [
      ...middleware,
    ];

    reducers = {
      ...reducers,
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
