import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import LandEntriesJSON from "./contracts/LandEntries.json";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import contract from "truffle-contract";

// var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

async function hello() {

  if (window.ethereum.isMetaMask) {
    await window.ethereum.enable();
    // console.log("res1")
    // console.log(res1)
    // console.log("ethereum:")
    // console.log(window.ethereum)
    // console.log("web3:")
    // console.log(window.web3)
    // console.log("currentProvider:")
    // console.log(window.web3.currentProvider)
    // console.log(window.ethereum)
    var web3 = new Web3(window.ethereum);
    // console.log("web3:")
    // console.log(web3)

    var LandEntries = contract(LandEntriesJSON);
    LandEntries.setProvider(web3);

    // console.log(LandEntries.deployed())

    const deployed = await LandEntries.deployed();
  } else {
    // console.log("ethereum.isMetaMask is undefined")
  }


  // if (typeof window.web3 !== 'undefined') {
  //   App.web3Provider = window.web3.currentProvider;
  //   var web3 = new Web3(window.web3.currentProvider);

  //   var LandEntries = contract(LandEntriesJSON);
    
  //   LandEntries.setProvider(web3);

  //   console.log(LandEntries)
  //   // console.log("123")
  //   // console.log(LandEntries.deployed())
  //   // console.log("1234")

  //   const deployed = await LandEntries.deployed();
  //   console.log("fdsad")
  //   console.log(deployed)

  //   // LandEntries.deployed().then(function(deployed) {
  //   //   console.log("fsf");
  //   //   return deployed.create(
  //   //     "title",
  //   //     "description",
  //   //     "documents_url",
  //   //     "image_url",
  //   //     [ 1, 2, 3]
  //   //   );
  //   // }).then(function(result) {
  //   //   console.log(result);
  //   // });



  //   console.log(1)
  // } else {
  //   // If no injected web3 instance is detected, fallback to Truffle Develop.
  //   App.web3Provider = new window.web3.providers.HttpProvider('http://127.0.0.1:9545');
  //   var web3 = new Web3(App.web3Provider);
  //   console.log(2)
  // }

}

// var h = await hello();

function Index() {
  return (
    <div>
      <h2>Welcome</h2>
      <p>You'll need to auth via MetaMask</p>
    </div>
  );
}

function Notary() {
  return (
    <form>
      <div>
        <label>
          Username:
          <input type="text" name="username" />
        </label>
      </div>
      <div>
        <label>
          Email:
          <input type="text" name="email" />
        </label>
      </div>
      <div>
        <label>
          Ethereum address:
          <input type="text" name="eth_address" />
        </label>
      </div>
      <div>
        <input type="submit" value="Submit" />
      </div>
    </form>
  );
}

class App extends React.Component {
  async componentDidMount() {
    await hello();
  }

  render() {
    return (
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Welcome</Link>
              </li>
              <li>
                <Link to="/notary/">Notary</Link>
              </li>
            </ul>
          </nav>

          <Route path="/" exact component={Index} />
          <Route path="/notary/" component={Notary} />
        </div>
      </Router>
    )
  }
}

export default App;
