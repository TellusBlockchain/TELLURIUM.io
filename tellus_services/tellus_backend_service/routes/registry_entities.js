var express = require('express');
var router = express.Router();

var models = require('../models');

const cors = require('cors');

router.get('/', cors(), async function(req, res, next) {
  let registry_entities = await models.RegistryEntity.findAll({
    order: [
      ['_id', 'DESC']
    ]
  });
  res.json(registry_entities);
});

module.exports = router;
