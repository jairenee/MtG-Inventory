import React from 'react'
import { Button } from 'react-bootstrap'

const ipcRenderer = window.require("electron").ipcRenderer;

export class SyncButton extends React.Component {
    constructor(props) {
        super(props);

        this.getData = this.getData.bind(this);
    }

    getData() {
        ipcRenderer.send(`store-${this.props.type}`)
        ipcRenderer.once(`${this.props.type}-stored`, (event, args) => {
            console.log(args);
        })
    }

    render() {
        return <Button bsSize="xsmall" onClick={this.getData}>Sync {this.props.type[0].toUpperCase() + this.props.type.substring(1)}</Button>
    }
}

export class ClearButton extends React.Component {
    constructor(props) {
        super(props);

        this.clearData = this.clearData.bind(this);
    }

    clearData() {
        ipcRenderer.send(`clear-cards`)
        ipcRenderer.once(`cards-cleared`, (event, args) => {
            console.log(args);
        })
    }

    render() {
        return <Button bsSize="xsmall" onClick={this.clearData}>Clear Saved</Button>
    }
}