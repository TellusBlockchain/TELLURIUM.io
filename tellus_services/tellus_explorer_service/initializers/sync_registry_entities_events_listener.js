const Web3 = require('web3');
const web3 = new Web3(process.env.WEB3_PROVIDER);
const RegistryEntitiesJSON = require("../../tellus_react/src/contracts/RegistryEntities.json");

let RegistryEntitiesContract = new web3.eth.Contract(
  RegistryEntitiesJSON.abi,
  RegistryEntitiesJSON["networks"][process.env.ETHEREUM_NETWORK]["address"]
);

const models = require('../models');

RegistryEntitiesContract.events.AfterRegistryEntityCreated({
  fromBlock: 'latest'
}).on('data', async function (event) {
  try {
    await models.Transaction.create({
      transactionHash: event.transactionHash,
      blockHash:       event.blockHash,
      blockNumber:     event.blockNumber,
      eventName:       event.event,
      returnValues:    JSON.stringify(event.returnValues)
    });
  } catch (e) {
    console.log(`Can't create Transaction with transactionHash=${event.transactionHash}`);
  }

  try {
    await models.RegistryEntity.create({
      _id: event.returnValues._id,
      title: event.returnValues._title,
      description: event.returnValues._description,
      documents_url: event.returnValues._documents_url,
      image_url: event.returnValues._image_url,
      points: JSON.stringify(event.returnValues._points),
      _created_at: event.returnValues._created_at
    });
  } catch (e) {
    console.log(`Can't create RegistryEntity with event.transactionHash=${event.transactionHash}`);
  }
}).on('changed', function (event) {
  // remove event from local database
}).on('error', console.log);