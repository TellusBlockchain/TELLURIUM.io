var express = require('express');
var router = express.Router();

const cors = require('cors');
const Web3 = require('web3');
const web3 = new Web3(process.env.WEB3_PROVIDER);

const crypto = require('crypto');

const UsersJSON = require("../../tellus_react/src/contracts/Users.json");
const send_invitation = require('../mailers/invites').send_invitation;

let UsersContract = new web3.eth.Contract(
  UsersJSON.abi,
  UsersJSON["networks"][process.env.ETHEREUM_NETWORK]["address"]
);

router.get('/send_invitation', cors(), async function(req, res, next) {
  let inviter_name = req.query.inviter_name || process.env["DEFAULT_INVITER_NAME"];

  let result;
  try {
    result = await send_invitation(inviter_name, req.query.mail_to);
  } catch (error) {
    return res.send({ error: error.stack });
  }

  res.send({ result });
});

router.get('/accept_invitation', cors(), async function(req, res, next) {
  const ordinary_user_role = '3';

  if (!req.query.email) {
    return res.send({ error: 'email field is required' });
  }

  if (!req.query.eth_address) {
    return res.send({ error: 'eth_address field is required' });
  }
  
  if (!req.query.token) {
    return res.send({ error: 'token field is required' });
  }

  let hash = crypto.createHash('md5')
    .update(req.query.email + '_' + process.env["INVITES_SECRET"])
    .digest('hex');

  if (req.query.token !== hash) {
    return res.send({ error: 'token is not valid' });
  }

  let result;
  try {
    result = await UsersContract.methods
      .create(req.query.eth_address, ordinary_user_role)
      .send({
        from: process.env["ADMIN_ADDRESS"],
        gas: 1000000
      });
  } catch (error) {
    return res.send({ error: error.stack });
  }

  res.send({ result });
});

module.exports = router;
