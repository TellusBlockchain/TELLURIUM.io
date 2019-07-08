const Web3 = require('web3');
const web3 = new Web3(process.env.WEB3_PROVIDER);
const RegistryEntitiesJSON = require("../../tellus_react/src/contracts/RegistryEntities.json");

let RegistryEntitiesContract = new web3.eth.Contract(
  RegistryEntitiesJSON.abi,
  RegistryEntitiesJSON["networks"][process.env.ETHEREUM_NETWORK]["address"]
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