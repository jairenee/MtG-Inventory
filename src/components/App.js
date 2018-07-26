import React from 'react'
import { Home, Sets, Cards, TopNav } from "../containers/Components"
import { BrowserRouter, Route } from "react-router-dom"

export default class App extends React.Component {
    render() {
      return (
        <BrowserRouter>
            <div>
                <TopNav />
                <Route exact path="/" component={Home}/>
                <Route path="/sets" component={Sets}/>
                <Route path="/cards" component={Cards}/>
            </div>
        </BrowserRouter>
      )
    }
  }