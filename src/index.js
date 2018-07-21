import React from 'react'
import {render} from 'react-dom'
import {
  BrowserRouter,
  Route
} from 'react-router-dom'
import {TopNav, Home, Sets, Cards} from './components/Components'

const ipcRenderer = window.require("electron").ipcRenderer,
      remote = window.require("electron").remote,
      userData = remote.app.getPath("userData");

// I'm just learning how this works here. Never used NeDB before.
let crud = require("./crud"), 
    Datastore = require('nedb'),
    db = {};

ipcRenderer.send("store-sets", {test: "event", hello: "world"});

ipcRenderer.on("store-sets-return", (event, args) => {
  console.log(event, args);
})

// db.sets = new Datastore();
// crud.getAllSets()
//   .then((setList) => {
//     for (let set in setList) {
//       db
//     }
//   })

// End learning.

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