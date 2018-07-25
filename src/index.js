import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { App } from "./containers/Components"
import { createStore } from 'redux'
import reducers from './reducers'

let store = createStore(reducers);

render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('app'));