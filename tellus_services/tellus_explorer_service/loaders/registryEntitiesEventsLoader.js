const Web3 = require('web3');
const web3 = new Web3("ws://ropsten.infura.io/v3/60227cbc12a1491f92b8456ab35e874a");
const RegistryEntitiesJSON = require("../../tellus_react/src/contracts/RegistryEntities.json");

let RegistryEntitiesContract = new web3.eth.Contract(
  RegistryEntitiesJSON.abi,
  RegistryEntitiesJSON["networks"]["3"]["address"]
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