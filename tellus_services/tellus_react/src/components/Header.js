import React from 'react';

import { Router as Router, Route, Link } from "react-router-dom";
import { Row, Col, Container, Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import contract from 'truffle-contract';
import UsersJSON from '../contracts/Users.json';

class Header extends React.Component {
  constructor (props) {
    super(props);
    this.tryToLoginViaMetamask = this.tryToLoginViaMetamask.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
  }

  handleLogoutClick () {
    localStorage.removeItem('current_user_role');
    localStorage.removeItem('token_is_valid');

    this.props.app.setState({
      current_user_role: null,
      token_is_valid: null
    });
    
    this.props.history.push('/');
  }

  async tryToLoginViaMetamask () {
    if (!window.ethereum) {
      console.warning('You are trying to login via MetaMask, but you have not installed MetaMask')
      return null;
    }
    
    const accounts = await window.ethereum.enable();
    if (accounts) {
      const Users = contract(UsersJSON);
  
      Users.setProvider(window.web3.currentProvider);
      Users.defaults({
        from: accounts[0]
      });
  
      const deployed = await Users.deployed();
      let role = await deployed.get_my_role();
      role = role.toNumber();

      this.setState({
        isLoginnedViaMetamask: true,
        role:                  role
      });

      localStorage.setItem('current_user_role', role);

      this.props.app.setState({ current_user_role: role });
      this.props.history.push('/registry_entities');
    }
  }

  render () {
    return (
      <Navbar className="mainHeader" variant="dark">
        {
          this.props.current_user_role != null || this.props.token_is_valid ? (
            <LinkContainer to="/registry_entities">
              <Navbar.Brand>
                    <img src="/tellurium-logo-white.png"
                         alt="TELLURIUM.IO logo"
                         srcSet="/tellurium-logo-white@2x.png 2x,
                                 /tellurium-logo-white@3x.png 3x"
                         className="Tellurium_logo_white" />
              </Navbar.Brand>
            </LinkContainer>
          ) : (
            <LinkContainer to="/">
              <Navbar.Brand>
                    <img src="/tellurium-logo-white.png"
                         alt="TELLURIUM.IO logo"
                         srcSet="/tellurium-logo-white@2x.png 2x,
                                 /tellurium-logo-white@3x.png 3x"
                         className="Tellurium_logo_white" />
              </Navbar.Brand>
            </LinkContainer>
          ) 
        }

        <Nav style={{ width: '100%' }} className="justify-content-end">
          {
            this.props.current_user_role != null || this.props.token_is_valid ? (
              <LinkContainer to="/registry_entities">
                <Nav.Link>
                  Decentralized Land Registry
                </Nav.Link>
              </LinkContainer>
            ) : null
          }
          {
            this.props.current_user_role != null ? (
              <LinkContainer to="/registry_entities/new">
                <Nav.Link>
                  New Registry Entity
                </Nav.Link>
              </LinkContainer>
            ) : null
          }
          {
            this.props.current_user_role === 1 || this.props.current_user_role === 2 ? (
              <LinkContainer to="/users">
                <Nav.Link>
                  Users
                </Nav.Link>
              </LinkContainer>
            ) : null
          }
          {
            this.props.current_user_role === 1 || this.props.current_user_role === 2 ? (
              <LinkContainer to="/users/new">
                <Nav.Link>
                  New User
                </Nav.Link>
              </LinkContainer>
            ) : null
          }
          {
            this.props.current_user_role != null ? (
              <LinkContainer to="/users/profile/my">
                <Nav.Link>
                  Profile
                </Nav.Link>
              </LinkContainer>
            ) : null
          }
          <LinkContainer to="/explorer">
            <Nav.Link>Explorer</Nav.Link>
          </LinkContainer>
          {
            this.props.current_user_role != null ? (
              null
            ) : (
              <Nav.Item>
                <button type="button"
                        className="signin_via_metamask_button"
                        onClick={this.tryToLoginViaMetamask}
                >Login via MetaMask</button>
              </Nav.Item>
            )
          }
          {
            this.props.current_user_role != null || this.props.token_is_valid ? (
              <LinkContainer to="#">
                <Nav.Link onClick={this.handleLogoutClick}>
                  Logout
                </Nav.Link>
              </LinkContainer>
            ) : null
          }
        </Nav>
      </Navbar>
    );
  }
}

export default Header;
