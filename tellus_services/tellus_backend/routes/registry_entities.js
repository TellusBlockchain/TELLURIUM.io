var express = require('express');
var router = express.Router();

var models = require('../models');

const cors = require('cors');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.get('/', cors(), async function(req, res, next) {
  let registry_entities = await models.RegistryEntity.findAll({
    order: [
      ['_id', 'DESC']
    ]
  });
  res.json(registry_entities);
});

router.get('/verified', cors(), async function(req, res, next) {
  let users = await models.User.findAll({
    where: {
      created_in_ethereum: true
    },
    order: [
      ['id', 'DESC']
    ]
  });

  let user_addresses = users.map((user) => user.eth_address);

  let registry_entities = await models.RegistryEntity.findAll({
    where: {
      creator_addr: user_addresses
    },
    order: [
      ['id', 'DESC']
    ]
  });

  res.send(registry_entities);
});

router.get('/unverified', cors(), async function(req, res, next) {
  let users = await models.User.findAll({
    where: {
      created_in_ethereum: true
    },
    order: [
      ['id', 'DESC']
    ]
  });

  let user_addresses = users.map((user) => user.eth_address);

  let registry_entities = await models.RegistryEntity.findAll({
    where: {
      creator_addr: {
        [Op.notIn]: user_addresses
      }
    },
    order: [
      ['id', 'DESC']
    ]
  });

  res.send(registry_entities);
});

module.exports = router;
