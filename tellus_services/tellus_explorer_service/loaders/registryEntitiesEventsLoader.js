const Web3 = require('web3');
const web3 = new Web3("ws://localhost:8545");
const RegistryEntitiesJSON = require("../../tellus_react/src/contracts/RegistryEntities.json");

let RegistryEntitiesContract = new web3.eth.Contract(
  RegistryEntitiesJSON.abi,
  RegistryEntitiesJSON["networks"]["5778"]["address"]
);

class registryEntitiesEventsLoader {
  async load_all() {
    let events = await RegistryEntitiesContract.getPastEvents("allEvents", {
      fromBlock: 0
    });

    return events;
  }
}

module.exports = registryEntitiesEventsLoader;