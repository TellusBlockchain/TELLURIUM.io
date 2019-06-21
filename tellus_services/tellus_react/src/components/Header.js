import React from 'react';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Header extends React.Component {
  render () {
    return (
      <nav>
        <ul className="mainHeader">
          <li>
            <Link to="/">Welcome</Link>
          </li>
          <li>
            <Link to="/users/new">New User</Link>
          </li>
          <li>
            <Link to="/registry_entities/new">New Registry Entity</Link>
          </li>
          <li>
            <Link to="/registry_entities/index">Registry Entities Index</Link>
          </li>
          <li>
            <Link to="/explorer">Explorer</Link>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Header;
