import React from 'react';

import contract from 'truffle-contract';
import UsersJSON from '../../contracts/Users.json';

import { Row, Col, Container } from 'react-bootstrap';
import MainWindow from '../../components/MainWindow'

class PagesWelcome extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isLoginnedViaMetamask: false
    };

    this.tryToLoginViaMetamask = this.tryToLoginViaMetamask.bind(this);
  }

  async componentDidMount () {
    // if (window.ethereum.selectedAddress) {
    //   await this.tryToLoginViaMetamask();
    // }
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

      this.props.app.setState({ current_user_role: role });
      this.props.history.push('/registry_entities');
    }
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
            <div className="signin_via_metamask_button_container">
              <button type="button"
                      className="signin_via_metamask_button"
                      onClick={this.tryToLoginViaMetamask}
              >Login via MetaMask</button>
            </div>
            {/* <div className="signin_as_notary_button_container">
              <button type="button"
                      className="signin_as_notary_button"
                      onClick={this.tryToLoginViaMetamask}
              >Sign in as Notary</button>
            </div> */}
          </Col>
        </Row>
      </MainWindow>
    );
  }
}

export default PagesWelcome;
