import React from 'react'
import { Button } from 'react-bootstrap'

const ipcRenderer = window.require("electron").ipcRenderer;

export class SyncButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {loading: false, loadingText: ""}
        this.getData = this.getData.bind(this);
    }

    getData() {
        this.setState({loading: true})
        ipcRenderer.send(`store-${this.props.type}`)
        ipcRenderer.on(`next-${this.props.type}-returned`, (event, args) => {
            console.log("Setting text")
            this.setState({loadingText: args})
        })
        ipcRenderer.on(`${this.props.type}-stored`, (event, args) => {
            this.setState({loading: false})
        })
    }

    render() {
        let buttonText;

        if (this.state.loading) {
            buttonText = this.state.loadingText || "Loading";
        } else {
            buttonText = `Sync ${this.props.type[0].toUpperCase() + this.props.type.substring(1)}`;
        }

        return <Button bsSize="xsmall" onClick={this.getData}>{buttonText}</Button>
    }
}

export class ClearButton extends React.Component {
    constructor(props) {
        super(props);

        this.clearData = this.clearData.bind(this);
    }

    clearData() {
        ipcRenderer.send(`clear-cards`)
        ipcRenderer.on(`cards-cleared`, (event, args) => {
            console.log(args);
        })
    }

    render() {
        return <Button bsSize="xsmall" onClick={this.clearData}>Clear Saved</Button>
    }
}