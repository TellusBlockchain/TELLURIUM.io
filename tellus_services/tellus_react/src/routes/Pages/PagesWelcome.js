import React from 'react';

import contract from 'truffle-contract';
import UsersJSON from '../../contracts/Users.json';

import WelcomeCard from '../../components/WelcomeCard'

class PagesWelcome extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isLoginnedViaMetamask: false
    };

    this.tryToLoginViaMetamask = this.tryToLoginViaMetamask.bind(this);
  }

  async componentDidMount () {
    if (window.ethereum.selectedAddress) {
      // await this.tryToLoginViaMetamask();
    }
  }

  async tryToLoginViaMetamask () {
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
        role: role
      });

      this.props.history.push('/registry_entities/index');
    }
  }

  render () {
    return (
      <WelcomeCard tryToLoginViaMetamask={this.tryToLoginViaMetamask}></WelcomeCard>
    );
  }
}

export default PagesWelcome;
