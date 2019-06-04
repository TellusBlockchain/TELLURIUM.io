import React from 'react';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Header extends React.Component {
  render () {
    return (
      <nav>
        <ul>
          <li>
            <Link to="/">Welcome</Link>
          </li>
          <li>
            <Link to="/users/new">New User</Link>
          </li>
          <li>
            <Link to="/registry_entities/new">New Registry Entity</Link>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Header;