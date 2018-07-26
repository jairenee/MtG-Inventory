import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { App } from "./containers/Components"
import { createStore, applyMiddleware, compose } from 'redux'
import reducers from './reducers'

const syncState = store => next => action => {
  return new Promise((res, rej) => {
    let result = next(action);
    res(result);
  })
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let store = createStore(reducers, composeEnhancers(applyMiddleware(syncState)));

render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('app'));