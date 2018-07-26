import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { App } from "./containers/Components"
import { createStore, applyMiddleware } from 'redux'
import reducers from './reducers'

const syncState = store => next => action => {
  return new Promise((res, rej) => {
    let result = next(action);
    res(result);
  })
}

let store = createStore(reducers, applyMiddleware(syncState));

render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('app'));