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

const UsersJSON = require("../contracts/Users.json");
let UsersContract = new web3.eth.Contract(
  UsersJSON.abi,
  UsersJSON["networks"][process.env.ETHEREUM_NETWORK]["address"]
);

UsersContract.events.AfterUserCreate({
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
    // console.log(`Successfully created Transaction with transactionHash=${event.transactionHash}`);
  } catch (err) {
    console.log(`Can't create Transaction with transactionHash=${event.transactionHash}`);
    console.log(err);
  }

  try {
    let user = await models.User.findOne({
      where: {
        eth_address: event.returnValues._addr
      }
    });

    if (user) {
      user.created_in_ethereum = true;
      await user.save();
    }
  } catch (err) {
    console.log(err);
  }
}).on('changed', function (event) {
}).on('error', console.log);