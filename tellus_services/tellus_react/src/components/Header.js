import React from 'react';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Row, Col, Container } from 'react-bootstrap';

class Header extends React.Component {
  render () {
    return (
      <nav className="mainHeader">
        <Container>
          <Row>
            <Col md="auto">
              <img src="/tellurium-logo-white.png"
                   srcSet="/tellurium-logo-white@2x.png 2x,
                          /tellurium-logo-white@3x.png 3x"
                   className="Tellurium_logo_white" />
            </Col>
            <Col className="nav-links-container">
              <div>
                <Link to="/">Welcome</Link>
              </div>
              {
                this.props.current_user_role === 1 || this.props.current_user_role === 2 ? (
                  <div>
                    <Link to="/users/new">New User</Link>
                  </div>
                ) : null
              }
              {
                this.props.current_user_role === 1 || this.props.current_user_role === 2 ? (
                  <div>
                    <Link to="/users/index">Users Index</Link>
                  </div>
                ) : null
              }
              {
                this.props.current_user_role === 1 || this.props.current_user_role === 2 ? (
                  <div>
                    <Link to="/registry_entities/new">New Registry Entity</Link>
                  </div>
                ) : null
              }
              {
                typeof this.props.current_user_role !== 'undefined' ? (
                  <div>
                    <Link to="/registry_entities/index">Registry Entities Index</Link>
                  </div>
                ) : null
              }
              <div>
                <Link to="/explorer">Explorer</Link>
              </div>
            </Col>
          </Row>
        </Container>
      </nav>
    );
  }
}

export default Header;
