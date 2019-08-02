const Web3 = require('web3');
const web3 = new Web3(process.env.WEB3_PROVIDER);
const UsersJSON = require("../contracts/Users.json");

let UsersContract = new web3.eth.Contract(
  UsersJSON.abi,
  UsersJSON["networks"][process.env.ETHEREUM_NETWORK]["address"]
);

class usersEventsLoader {
  async load_all() {
    let events = await UsersContract.getPastEvents("AfterUserCreate", {
      fromBlock: 0
    });

    return events;
  }
}

module.exports = usersEventsLoader;