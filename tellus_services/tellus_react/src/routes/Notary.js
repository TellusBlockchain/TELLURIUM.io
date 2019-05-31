import React from 'react';

import contract from "truffle-contract";
import UsersJSON from "../contracts/Users.json";

class Notary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      email: "",
      address: ""
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
      deployed.create(this.state.address);
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
    const { username, email, address } = this.state;

    return (
      <form>
        <div>
          <label>
            Username:
            <input type="text"
                   name="username"
                   value={username}
                   onChange={this.handleInputChange} />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input type="text"
                   name="email"
                   value={email}
                   onChange={this.handleInputChange} />
          </label>
        </div>
        <div>
          <label>
            Ethereum address:
            <input type="text"
                   name="address"
                   value={address}
                   onChange={this.handleInputChange} />
          </label>
        </div>
        <div>
          <button type="button" onClick={this.handleClick}>
            Validate
          </button>
        </div>
      </form>
    );
  }
}

export default Notary;