var express = require('express');
var router = express.Router();

var models = require('../models');

const cors = require('cors');

router.options('/', cors());

router.get('/', cors(), async function(req, res, next) {
  let users = await models.User.findAll();
  res.send(users);
});

router.post('/', cors(), async function(req, res, next) {
  try {
    let user = await models.User.create({
      email:       req.body.email,
      username:    req.body.username,
      eth_address: req.body.eth_address,
      role:        req.body.role
    });

    res.send(user);
  } catch (err) {
    console.log(`Can't create User with eth_address=${req.body.eth_address}`);
    console.log(err);

    res.send({ "error": `Can't create User with eth_address=${req.body.eth_address}` });
  }
});

module.exports = router;
