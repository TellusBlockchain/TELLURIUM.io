import React from 'react';

import contract from "truffle-contract";
import UsersJSON from "../../contracts/Users.json";

class PagesWelcome extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isLoginnedViaMetamask: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount () {
    if (window.ethereum.selectedAddress) {
      // console.log(window.ethereum.selectedAddress)
      await this.handleClick();
    }
  }

  async handleClick () {
    const accounts = await window.ethereum.enable();
    if (accounts) {
      const Users = contract(UsersJSON);
  
      Users.setProvider(window.web3.currentProvider);
      Users.defaults({
        from: accounts[0]
      });
  
      const deployed = await Users.deployed();
      let role = await deployed.get_my_role();

      this.setState({
        isLoginnedViaMetamask: true,
        role: role.words[0]
      });
    }
  }

  render () {
    return (
      <React.Fragment>
        <h2>Welcome</h2>
        {
          this.state.isLoginnedViaMetamask ? (
            this.state.role === 1 ? (
              <React.Fragment>
                <p>You logined via MetaMask as Deployer</p>
              </React.Fragment>
            ) : (
              this.state.role === 2 ? (
                <React.Fragment>
                  <p>You logined via MetaMask as Notary</p>
                </React.Fragment>
              ) : (
                this.state.role === 3 ? (
                  <React.Fragment>
                    <p>You logined via MetaMask as a common User</p>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <p>You are not in validated users list</p>
                  </React.Fragment>
                )
              )
            )
          ) : (
            <React.Fragment>
              <p>You'll need to auth via MetaMask</p>
              <button type="button"
                      onClick={this.handleClick}>Login via MetaMask</button>
            </React.Fragment>
          )
        }
      </React.Fragment>
    );
  }
}

export default PagesWelcome;