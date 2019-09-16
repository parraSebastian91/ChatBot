import React from "react";
import "./Menu.css";

import amandaIcon from './amanda.png'
// import refreshSvg from './back.svg'
import menuSvg from './menu.svg'

export default class Menu extends React.Component {
  render() {
    return (
      <div className="menu">
        <a href="./" className="menu-icon">
          <img alt="icon" src={amandaIcon} />
        </a>
        <p className="menu-space" />
        {/* <a href="./" className="menu-menu">
          <img alt="refresh" src={refreshSvg} />
        </a> */}
        <a href="./" className="menu-close">
          <img alt="menu" src={menuSvg} />
        </a>
      </div>
    );
  }
}
