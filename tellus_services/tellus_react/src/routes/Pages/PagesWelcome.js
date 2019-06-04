import React from 'react';

class PagesWelcome extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isLoginnedViaMetamask: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount () {
    // console.log(window.ethereum)
    // console.log(window.web3.currentProvider)
    // console.log(window.ethereum.isMetaMask)
    // console.log(window.ethereum.selectedAddress)

    if (window.ethereum.selectedAddress) {
      this.setState({ isLoginnedViaMetamask: true });
    }

    // const accounts = await window.ethereum.enable();
    // console.log(accounts);
  }

  async handleClick () {
    const accounts = await window.ethereum.enable();
    if (accounts) {
      this.setState({ isLoginnedViaMetamask: true });
    }
  }

  render () {
    return (
      <React.Fragment>
        <h2>Welcome</h2>
        {
          this.state.isLoginnedViaMetamask ? (
            <p>You logined via MetaMask</p>
          ) : (
            <React.Fragment>
              <p>You'll need to auth via MetaMask</p>
              <button type="button" onClick={this.handleClick}>Login via MetaMask</button>
            </React.Fragment>
          )
        }
      </React.Fragment>
    );
  }
}

export default PagesWelcome;