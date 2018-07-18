import React from 'react'

export class Home extends React.Component {
    // TODO: Make this pretty
    //       Quick search
    //       Recent decks
    //       Quick add to inventory
    render() {
      return (
        <div>
            <center>
                <h2>MtG Inventory</h2>
                <p className="lead">A tool for quickly finding and sorting information about MtG Cards</p>
            </center>
        </div>
      )
    }
  }