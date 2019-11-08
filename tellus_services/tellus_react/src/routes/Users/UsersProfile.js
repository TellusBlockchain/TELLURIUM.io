import React from 'react';

import contract from "truffle-contract";
import UsersJSON from "../../contracts/Users.json";

import { Row, Col, Form, Button, InputGroup, FormControl, Container } from 'react-bootstrap';

const ORDINARY_USER = 3;

class UsersProfile extends React.Component {
  constructor (props) {
    super(props);

    let role_str;

    if (this.props.app.state.current_user_role === 0) {
      role_str = 'Undefined Role'
    } else if (this.props.app.state.current_user_role === 1) {
      role_str = 'Deployer'
    } else if (this.props.app.state.current_user_role === 2) {
      role_str = 'Notary'
    } else if (this.props.app.state.current_user_role === 3) {
      role_str = 'Ordinary User'
    }

    this.state = {
      account: null,
      role_str: role_str
    }
  }

  async componentDidMount () {
    const accounts = await window.ethereum.enable();

    this.setState({
      account: accounts[0]
    })
  }

  render() {
    return (
      <>
        <Container>
          <Row>
            <Col md={{ span: 8, offset: 2 }} className="bg_card" style={{ marginTop: '20px', marginBottom: '110px' }}>
              <div className="Notary-Page" style={{ marginTop: '30px' }}>
                PROFILE
              </div>
              <Row style={{ margin: '50px 0 50px 0' }}>
                <Col>
                  Ethereum Address: {this.state.account}<br/>
                  Your role: {this.state.role_str} <br/>
                  <a href="#">My Registry Entities</a>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default UsersProfile;