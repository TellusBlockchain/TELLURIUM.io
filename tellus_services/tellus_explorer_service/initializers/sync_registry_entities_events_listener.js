const Web3 = require('web3');
const web3 = new Web3("wss://ropsten.infura.io/v3/60227cbc12a1491f92b8456ab35e874a");
const RegistryEntitiesJSON = require("../../tellus_react/src/contracts/RegistryEntities.json");

let RegistryEntitiesContract = new web3.eth.Contract(
  RegistryEntitiesJSON.abi,
  RegistryEntitiesJSON["networks"]["3"]["address"]
);

const models = require('../models');

RegistryEntitiesContract.events.AfterRegistryEntityCreate({
  fromBlock: 0
})
.on('data', async function (event) {
  await models.Transaction.create({
    transactionHash: event.transactionHash,
    blockHash: event.blockHash,
    blockNumber: event.blockNumber,
    eventName: event.event,
    returnValues: JSON.stringify(event.returnValues)
  });
})
.on('changed', function (event) {
  // remove event from local database
})
.on('error', console.error);