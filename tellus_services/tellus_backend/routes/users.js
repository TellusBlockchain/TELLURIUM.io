var express = require('express');
var router = express.Router();

var models = require('../models');

router.get('/', async function(req, res, next) {
  let users = await models.User.findAll();
  res.send(users);
});

module.exports = router;
