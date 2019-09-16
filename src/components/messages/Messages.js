import React from "react";
// import Websocket from "ws";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCog, faEnvelopeOpenText, faStore, faQuestion } from '@fortawesome/free-solid-svg-icons'

import "./Messages.css";
import { A } from "../../lib";
import MarkdownIt from 'markdown-it'

// const map = new A()._map;
const a = new A();
const { _map: map, _filter: filter } = a
const md = new MarkdownIt({ html: false, xhtmlOut: true, breaks: true, linkify: true, typographer: true });
var defaultRender = md.renderer.rules.link_open || (function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
});
md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
    // If you are sure other plugins can't add `target` - drop check below
    var targetIndex = tokens[idx].attrIndex('target');
    if (targetIndex < 0) {
        tokens[idx].attrPush(['target', '_blank']); // add new attribute
    }
    else {
        tokens[idx].attrs[targetIndex][1] = '_blank'; // replace value of existing attr
    }
    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self);
};

export default class Messages extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.sendMessage = this.sendMessage.bind(this)
    }
    formatActivity() {
        return map(this.props.activities, activity => {
            // if (activity.name) {
            //     this.props.activities.pop(activity.id);
            // }
            if (activity.text && activity.attachments) {
                return this.formatAttachment(activity)
            } else if (activity.text) {
                return this.formatText(activity);
            }
        });
    }
    iconAssign(e) {
        const titleList = [{ title: 'Seguimiento Orden', icon: faArrowRight },
        { title: 'Servicios Postventa', icon: faCog },
        { title: 'Ingreso Solicitud', icon: faEnvelopeOpenText },
        { title: 'Información Tiendas', icon: faStore },
        { title: 'Tengo una pregunta', icon: faQuestion }]
        return filter(titleList, (a) => a.title === e)[0].icon
    }
    formatText(e) {
        return (
            <div className="message-container" id={e.id} key={e.id}>
                <div className="text-container" dangerouslySetInnerHTML={this.formatLink(e.text)} >
                </div>
                <span>{e.name || e.from.name}</span>
            </div>
        );
    }
    formatLink(text) {
        if (text.trim()) {
            var src = text
                .replace(/<br\s*\/?>/ig, '\n')
                .replace(/\[(.*?)\]\((.*?)( +".*?"){0,1}\)/ig, function(match, text, url, title) { return "[" + text + "](" + md.normalizeLink(url) + (title === undefined ? '' : title) + ")"; });
            var arr = src.split(/\n *\n|\r\n *\r\n|\r *\r/);
            var ma = map(arr, (a) => md.render(a))
            var __html = ma.join('<br/>');
            return { __html }
        }
    }
    sendMessage(e) {
        console.log(e.target.textContent)
        this.props.sendMessages({ text: e.target.textContent });
    }
    formatAttachment(activity) {
        return (
            <div className="message-container" id={activity.id} key={activity.id}>
                <div className="text-container">
                    <p>{activity.text}</p>
                    {map(activity.attachments[0].content.buttons, e => {
                        return <button onClick={this.sendMessage}><FontAwesomeIcon icon={this.iconAssign(e.title)} />{e.title}</button>
                    })}
                </div>
                <span>{activity.from.name}</span>
            </div>
        );
    }
    render() {
        return this.formatActivity();
    }
}
