import React from 'react'
import {render} from 'react-dom'
import {
  BrowserRouter,
  Route
} from 'react-router-dom'
import {TopNav, Home, Sets, Cards} from './components/Components'

// let remote = window.require("electron").remote;

// console.log(remote.app.getPath("userData"));

class App extends React.Component {
  render() {
    return (
      <div>
        <TopNav />
        <Route exact path="/" component={Home}/>
        <Route path="/sets" component={Sets}/>
        <Route path="/cards" component={Cards}/>
      </div>
    )
  }
}

render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('app'));