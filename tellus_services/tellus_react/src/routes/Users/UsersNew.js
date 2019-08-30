import React from 'react';

import contract from "truffle-contract";
import UsersJSON from "../../contracts/Users.json";

import { Row, Col, Form, Button, InputGroup, FormControl, Container } from 'react-bootstrap';
import MainWindow from '../../components/MainWindow'

const ORDINARY_USER = 3;

class UsersNew extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      eth_address: '',
      invitation_email: '',
      email_preview_url: ''
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleClickIfIsMetaMask = this.handleClickIfIsMetaMask.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSendInviteButtonClick = this.handleSendInviteButtonClick.bind(this);
  }

  async handleSendInviteButtonClick() {
    let url = `${process.env.REACT_APP_BACKEND_URL}/invites/send_invitation?mail_to=${this.state.invitation_email}`;
    let response = await fetch(url);
    response = await response.json();
    console.log(response);
    if (response && response.result&& response.result.preview_url) {
      this.setState({ email_preview_url: response.result.preview_url });
    }
  }

  async handleClickIfIsMetaMask() {
    let url = `${process.env.REACT_APP_BACKEND_URL}/users`;
    let params = {
      email: this.state.email,
      username: this.state.username,
      eth_address: this.state.eth_address,
      role: ORDINARY_USER
    };
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    console.log(response);

    const accounts = await window.ethereum.enable();
    const Users = contract(UsersJSON);

    Users.setProvider(window.web3.currentProvider);
    Users.defaults({
      from: accounts[0]
    });

    const deployed = await Users.deployed();

    try {
      await deployed.create(this.state.eth_address, ORDINARY_USER);
    } catch (err) {
      console.log(err);
    }
  }

  async handleClick() {
    if (window.ethereum.isMetaMask) {
      this.handleClickIfIsMetaMask();
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
      <>
        <MainWindow style={{ marginTop: '110px' }}>
          <Row>
            <Col style={{ padding: '30px' }}>
              <div className="Notary-Page">
                NOTARY PAGE
              </div>
              <Form>
                <Form.Group controlId="formUsername">
                  <Form.Label>Username:</Form.Label>
                  <Form.Control type="text"
                                placeholder="Username"
                                name="username"
                                value={this.state.username}
                                onChange={this.handleInputChange} />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control type="text"
                                placeholder="Email"
                                name="email"
                                value={this.state.email}
                                onChange={this.handleInputChange} />
                </Form.Group>
                <Form.Group controlId="formEthAddress">
                  <Form.Label>Ethereum address:</Form.Label>
                  <Form.Control type="text"
                                placeholder="Ethereum address, e.g. 0x769048c07D7B7f55cD58c14BbE7d828da555dc08"
                                name="eth_address"
                                value={this.state.eth_address}
                                onChange={this.handleInputChange} />
                </Form.Group>
                <Row className="justify-content-md-center">
                    <Button type="button"
                            onClick={this.handleClick}
                            variant='success'
                            style={{ margin: '40px 0 40px 0' }}
                    >
                      VALIDATE
                    </Button>
                </Row>
              </Form>
            </Col>
          </Row>
        </MainWindow>
        <Container>
          <Row>
            <Col md={{ span: 8, offset: 2 }} className="bg_card" style={{ marginTop: '20px', marginBottom: '110px' }}>
              <div className="Notary-Page" style={{ marginTop: '30px' }}>
                SEND INVITATION
              </div>
              <Row style={{ margin: '50px 0 50px 0' }}>
                <Col>
                  <InputGroup>
                    <FormControl
                      placeholder="Email"
                      name='invitation_email'
                      autoComplete='off'
                      onChange={this.handleInputChange}
                      value={this.state.invitation_email}
                    />
                    <InputGroup.Append>
                      <Button variant="success"
                              onClick={this.handleSendInviteButtonClick}
                      >SEND INVITE</Button>
                    </InputGroup.Append>
                  </InputGroup>
                  <div style={{ wordWrap: 'break-word' }}>
                    <a target='_blank' href={this.state.email_preview_url}>
                      {this.state.email_preview_url}
                    </a>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default UsersNew;