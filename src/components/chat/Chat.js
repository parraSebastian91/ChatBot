import React from "react";

import Messages from "../messages/Messages";

import "./Chat.css";

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <div className="chat">
        <div className="messages-container">
          <Messages activities={this.props.activities} sendMessages={this.props.sendMessages} />
        </div>
      </div>
    );
  }
}
