const models = require('../models');

const Web3 = require('web3');
const web3 = new Web3(process.env.WEB3_PROVIDER);

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