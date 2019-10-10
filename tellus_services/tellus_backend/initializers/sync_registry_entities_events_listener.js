const models = require('../models');

const Web3 = require('web3');
const ROPSTEN_WSS = 'wss://ropsten.infura.io/ws';
let provider = new Web3.providers.WebsocketProvider(ROPSTEN_WSS);

provider.on('error', e => {
  console.error('WS Infura Error', e);
});

provider.on('end', e => {
  console.log('WS closed');
  console.log('Attempting to reconnect...');
  provider = new Web3.providers.WebsocketProvider(ROPSTEN_WSS);
  provider.on('connect', function () {
      console.log('WSS Reconnected');
  });
  web3.setProvider(provider);
});

const web3 = new Web3(provider);

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