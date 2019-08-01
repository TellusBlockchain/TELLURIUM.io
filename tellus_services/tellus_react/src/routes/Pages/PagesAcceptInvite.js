import React from 'react';

import contract from 'truffle-contract';
import UsersJSON from '../../contracts/Users.json';

import { Row, Col, Container, InputGroup, Form } from 'react-bootstrap';
import MainWindow from '../../components/MainWindow'

class PagesWelcome extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isLoginnedViaMetamask: false,
      username: '',
      query_params: {}
    };

    this.tryToLoginViaMetamask = this.tryToLoginViaMetamask.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  async componentDidMount () {
    let query_params_str = this.props.location.search.split('?')[1];
    let query_params = {};
    query_params_str.split('&').map( (query_param) => {
      let [ k, v ] = query_param.split('=');
      query_params[k] = v;
    });
    this.setState({ query_params });
  }

  async tryToLoginViaMetamask () {
    if (!window.ethereum) {
      return null;
    }
    
    const accounts = await window.ethereum.enable();
    if (accounts) {
      let url = `${process.env.REACT_APP_BACKEND_URL}/invites/accept_invitation?`;
      url += 'eth_address=' + accounts[0];
      url += '&email=' + this.state.query_params['email'];
      url += '&token=' + this.state.query_params['token'];
      
      let response = await fetch(url);
      response = await response.json();
      console.log(response);

      const Users = contract(UsersJSON);
  
      Users.setProvider(window.web3.currentProvider);
      Users.defaults({
        from: accounts[0]
      });
  
      const deployed = await Users.deployed();
      let role = await deployed.get_my_role();
      role = role.toNumber();

      if (!role || role === 0) {
        console.log(role);
        return null;
      }

      this.setState({
        isLoginnedViaMetamask: true,
        role: role
      });

      this.props.app.setState({ current_user_role: role });
      this.props.history.push('/registry_entities/index');
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

  render () {
    return (
      <MainWindow style={{ marginTop: '110px' }}>
        <Row>
          <Col className="separator_hor">
            <div>
              <img src="/tellurium-logo.png"
                  srcSet="/tellurium-logo@2x.png 2x,
                          /tellurium-logo@3x.png 3x"
                  className="Tellurium_logo" />
            </div>
            <div>
              <img src="/art.jpg"
                  srcSet="/art@2x.jpg 2x,
                          /art@3x.jpg 3x"
                  className="art" />
            </div>
            <div className="With-Proof-of-Ownership">
              With Proof of Ownership on the Blockchain property owners can
              express their real estate rights in the crypto economy with
              our Patent Pending Blockchain Protocol.
            </div>
          </Col>
          <Col>
            <div className="Welcome">
              Welcome!
            </div>
            <div style={{ padding: '0 50px 0 50px', marginTop: '100px' }}>
              <div>
                1. Choose your username
              </div>
              <InputGroup>
                <Form.Control type="text"
                              placeholder="Username"
                              name="username"
                              autoComplete='off'
                              value={this.state.username}
                              onChange={this.handleInputChange}
                />
              </InputGroup>
              <div style={{ marginTop: '46px' }}>
                2. Login with MetaMask to proceed
              </div>
              <div className="signin_via_metamask_button_container_invite_page">
                <button type="button"
                        className="signin_via_metamask_button"
                        onClick={this.tryToLoginViaMetamask}
                >Login with MetaMask</button>
              </div>
            </div>
          </Col>
        </Row>
      </MainWindow>
    );
  }
}

export default PagesWelcome;
