const models = require('../models');

const Web3 = require('web3');
const web3 = new Web3();

const ROPSTEN_WSS = 'wss://ropsten.infura.io/ws';

const init_provider = function () {
  let provider = new Web3.providers.WebsocketProvider(ROPSTEN_WSS);

  provider.on('error', e => {
    console.error('WSS error', e);
  });

  provider.on('end', e => {
    console.log('WSS closed');
    console.log('Attempting to reconnect...');
    init_provider().on('connect', function () {
      console.log('WSS reconnected');
    });
  });

  web3.setProvider(provider);

  return provider;
}

init_provider().on('connect', function () {
  console.log('WSS connected');
});;

const RegistryEntitiesJSON = require("../contracts/RegistryEntities.json");
let RegistryEntitiesContract = new web3.eth.Contract(
  RegistryEntitiesJSON.abi,
  RegistryEntitiesJSON["networks"][process.env.ETHEREUM_NETWORK]["address"]
);

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
    console.log(`Successfully created Transaction with transactionHash=${event.transactionHash}`);
  } catch (err) {
    console.log(`Can't create Transaction with transactionHash=${event.transactionHash}`);
    console.log(err);
  }

  try {
    await models.RegistryEntity.create({
      _id: event.returnValues._id,
      title: event.returnValues._title,
      description: event.returnValues._description,
      documents_url: event.returnValues._documents_url,
      image_url: event.returnValues._image_url,
      priceUSD: event.returnValues.priceUSD,
      points: JSON.stringify(event.returnValues._points),
      _created_at: event.returnValues._created_at
    });
    console.log(`Successfully created RegistryEntity with transactionHash=${event.transactionHash}`);
  } catch (err) {
    console.log(`Can't create RegistryEntity with transactionHash=${event.transactionHash}`);
    console.log(err);
  }
}).on('changed', function (event) {
}).on('error', console.log);