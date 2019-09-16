import React from "react";
import Axios from "axios";
// import DirectLine from "botframework-directlinejs";

import "./Amanda.css";
import { _env_ } from "../../lib";

import Menu from "../menu/Menu";
import Chat from "../chat/Chat";
import Text from "../text/Text";

export default class Amanda extends React.Component {
    constructor() {
        super();
        this.state = {
            conn: {},
            activities: []
        };
        this.userId = Date.now().toString();
        this.userName = "yo";
        this.sendMessages = this.sendMessages.bind(this);
        // this.addMessage = this.addMessage.bind(this);
        this.incommingMessages = this.incommingMessages.bind(this);
    }

    async componentDidMount() {
        await this.initConnection();
    }
    async initConnection() {
        const token = await this.getToken();
        const baseUrl = _env_.directLineUrl;
        const conversations = baseUrl + "/conversations";
        const connection = await Axios.post(conversations, null, {
            headers: { authorization: "Bearer " + token }
        });
        this.connectWebSocet(connection.data.streamUrl);
        this.postActivity(
            this.initActivity(),
            connection.data.token,
            connection.data.conversationId
        );
        const { conn } = this.state;
        conn.streamUrl = connection.data.streamUrl;
        conn.token = connection.data.token;
        conn.conversationId = connection.data.conversationId;
        this.setState({
            conn
        });
    }
    initActivity() {
        const id = this.userId;
        const name = this.userName;
        return {
            from: {
                id,
                name
            },
            name: "iniciarSaludo",
            type: "event",
            value: {
                sessionId: "",
                tokenQuiebre: "",
                giftcard: ""
            }
        };
    }
    async getToken() {
        const tokenUrl = _env_.tokenUrl;
        const resp = await Axios.get(tokenUrl);
        if (resp.status && resp.status === 200) {
            return resp.data.token;
        }
    }
    connectWebSocet(streamUrl) {
        const that = this;
        const ws = new WebSocket(streamUrl);
        // ws.onopen = function(v, e) {
        //   console.log("open", v);
        // };
        ws.onmessage = function(e) {
            that.incommingMessages(e);
        };
    }
    userActivity(message) {
        const id = this.userId;
        const name = this.userName;
        return {
            textFormat: "plain",
            text: message,
            type: "message",
            from: {
                id,
                name
            },
            locale: "es",
            entities: [
                {
                    requiresBotState: true,
                    supportsListening: true,
                    supportsTts: true,
                    type: "ClientCapabilities"
                }
            ]
        };
    }
    incommingMessages(evt) {
        if (evt.data !== "") {
            const { activities } = this.state;
            const parseActivity = JSON.parse(evt.data);
            const activityData = parseActivity.activities[0];
            if (activityData.text || activityData.attachment) {
                activities.push(activityData);
                this.setState({
                    activities
                });
            }
        }
    }
    async sendMessages(e) {
        const activity = this.userActivity(e.text);
        await this.postActivity(activity, null, null);
        // this.addMessage(e);
    }
    //   addMessage(e) {
    //     const { activities } = this.state;
    //     activities.push({
    //       text: e.text,
    //       id: this.userId,
    //       name: this.userName
    //     });
    //     this.setState({
    //       activities
    //     });
    //   }
    async postActivity(activity, _token, _conversationId) {
        const token = _token || this.state.conn.token;
        const conversationId = _conversationId || this.state.conn.conversationId;
        const baseUrl = _env_.directLineUrl;
        const conversations = baseUrl + "/conversations";
        const url = conversations + "/" + conversationId + "/activities";
        await Axios.post(url, activity, {
            headers: { authorization: "Bearer " + token }
        });
    }
    render() {
        return (
            <div className="container">
                <Menu />
                <Chat activities={this.state.activities} sendMessages={this.sendMessages} />
                <Text sendMessages={this.sendMessages} />
            </div>
        );
    }
}

//   async refreshToken(oldToken) {
//   const tokenUrl = _env_.tokenUrl
//     const data = await Axios.post(tokenUrl, { token: oldToken } );
//     if (data.token) {
//       return data.token;
//     }
//   }
//   window.setInterval(function() {
//     console.log("refreshing token");
//     this.refreshToken(data.token);
//   }, 1000 * 60 * 25);
