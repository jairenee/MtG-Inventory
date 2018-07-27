import React from 'react'
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import { tada as animation } from 'react-animations';
import { StyleSheet, css } from 'aphrodite';

let ipcRenderer = window.require("electron").ipcRenderer;

export default class FlippingCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {saidHi: false, flipStyle: {}};
        this.state = {backSide: ""}
    }

    componentDidMount() {
        console.log(this.props)
        ipcRenderer.send("get-back-side", {set: this.props.set, number: this.props.number})
        ipcRenderer.on(`back-side-${this.props.number}`, (event, imageUrl) => {
            this.setState({backSide: imageUrl})
        })
    }

    render() {
        var VisibilitySensor = require('react-visibility-sensor');

        let that = this;

        const styles = StyleSheet.create({
            flippable: {
                animationName: animation,
                animationDuration: '1s'
            }
        })

        var onChange = function (isVisible) {
            if (isVisible && !that.state.saidHi) {
                that.setState({flipStyle: styles.flippable, saidHi: true});
            }
        };

        return (
        <VisibilitySensor delayedCall={true} onChange={onChange}>
            <Flippy style={{width: 200}}>
                <FrontSide style={{padding:0, margins:0}}>
                    <img alt={`${this.props.set}-${this.props.number.replace(/a|b/, "")} (Front Side)`} 
                         style={{borderRadius: 10}} className={css(this.state.flipStyle)} 
                         src={this.props.thisSide}></img>
                </FrontSide>
                <BackSide style={{padding:0, margins:0}}>
                    <img alt={`${this.props.set}-${this.props.number.replace(/a|b/, "")} (Back Side)`}
                         style={{borderRadius: 10}} 
                         src={this.state.backSide}></img>
                </BackSide>
            </Flippy>
        </VisibilitySensor>
        )
    }
}