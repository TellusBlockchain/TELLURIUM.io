import React from 'react';

import contract from "truffle-contract";
import UsersJSON from "../../contracts/Users.json";

import { Row, Col, Form, Button } from 'react-bootstrap';

class UsersNew extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      username: "",
      email: "",
      eth_address: ""
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  async handleClick() {
    if (window.ethereum.isMetaMask) {
      const accounts = await window.ethereum.enable();
      const Users = contract(UsersJSON);
  
      Users.setProvider(window.web3.currentProvider);
      Users.defaults({
        from: accounts[0]
      });
  
      const deployed = await Users.deployed();
      deployed.create(this.state.eth_address, 0);
    } else {
  
    }
  }

  handleInputChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
        [name]: value
    });
  }

  render() {
    return (
      <Form>
        <Form.Group controlId="formUsername" as={Row}>
          <Form.Label column sm={2}>Username:</Form.Label>
          <Col sm={10}>
            <Form.Control type="text"
                          placeholder="Username"
                          name="username"
                          value={this.state.username}
                          onChange={this.handleInputChange} />
          </Col>
        </Form.Group>
        <Form.Group controlId="formEmail" as={Row}>
          <Form.Label column sm={2}>Email:</Form.Label>
          <Col sm={10}>
            <Form.Control type="text"
                          placeholder="Email"
                          name="email"
                          value={this.state.email}
                          onChange={this.handleInputChange} />
          </Col>
        </Form.Group>
        <Form.Group controlId="formEthAddress" as={Row}>
          <Form.Label column sm={2}>Ethereum address:</Form.Label>
          <Col sm={10}>
            <Form.Control type="text"
                          placeholder="Ethereum address, ex. 0x769048c07D7B7f55cD58c14BbE7d828da555dc08"
                          name="eth_address"
                          value={this.state.eth_address}
                          onChange={this.handleInputChange} />
          </Col>
        </Form.Group>
        <Row>
          <Col>
            <Button type="button" onClick={this.handleClick}>
              Validate
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default UsersNew;