import React from 'react'
import {render} from 'react-dom'
import {
  BrowserRouter,
  Route
} from 'react-router-dom'
import {TopNav, Home, Sets, Cards} from './components/Components'

// I'm just learning how this works here. Never used NeDB before.
var Datastore = require('nedb');
var db = new Datastore({filename: "./datastore", autoload: true});

db.find({ name: 'testVar'}, (err, docs) => {
  if (err) {
    console.log(err);
  } else {
    if (!docs.length) {
      console.log("Creating");
      let doc = { name: 'testVar',
                  quantity : 100
                };

      db.insert(doc, function (err, newDoc) {  
        if (err) {
          console.log(err);
        } else {
          console.log(newDoc);
        }
      });
    } else {
      console.log("Read")
      console.log(docs);
    }
  }
})
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