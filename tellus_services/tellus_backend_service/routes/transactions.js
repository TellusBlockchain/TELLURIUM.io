var express = require('express');
var router = express.Router();

var models = require('../models');

const cors = require('cors');

router.get('/', cors(), async function(req, res, next) {
  let transactions = await models.Transaction.findAll({
    order: [
      ['blockNumber', 'DESC']
    ]
  });
  res.json(transactions);
});

module.exports = router;
