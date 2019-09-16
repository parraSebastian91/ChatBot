import React from "react";
// import Axios from "axios";

import "./Text.css";
import inconSvg from './send.svg'

export default class Text extends React.Component {
    constructor() {
        super();
        this.sendMessage = this.sendMessage.bind(this);
        this.onMessageAdd = this.onMessageAdd.bind(this);
        this.state = {
            message: ''
        }
    }
    message;
    sendMessage(e) {
        const { message } = this.state
        this.props.sendMessages({ text: message });
        this.setState({
            message: ''
        })
    }
    onMessageAdd(e) {
        this.setState({
            message: e.target.value
        })
    }

    render() {
        return (
            <div className="text">
                <textarea
                    className="text-msg"
                    onChange={this.onMessageAdd}
                    maxLength="140"
                    placeholder="Escribe tu mensaje..."
                    aria-label="Escribe tu mensaje..."
                    aria-live="polite"
                    value={this.state.message}
                />
                <button className="text-send" onClick={this.sendMessage}>
                    <img alt="send" src={inconSvg} />
                </button>
            </div>
        );
    }
}
