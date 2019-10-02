var express = require('express');
var router = express.Router();

var models = require('../models');

const cors = require('cors');
const crypto = require('crypto');

router.options('/', cors());

router.get('/', cors(), async function(req, res, next) {
  let users = await models.User.findAll({
    where: {
      created_in_ethereum: true
    },
    order: [
      ['id', 'DESC']
    ]
  });
  res.send(users);
});

router.get('/check_token', cors(), async function(req, res, next) {
  if (!req.query.email) {
    return res.send({ error: 'email field is required' });
  }
  if (!req.query.token) {
    return res.send({ error: 'token field is required' });
  }

  let hash = crypto.createHash('md5')
    .update(req.query.email + '_' + process.env["INVITES_SECRET"])
    .digest('hex');

  res.send({ token_is_valid: (req.query.token === hash) });
});

// router.get('/reset', cors(), async function(req, res, next) {
//   await models.User.sync({ force: true });
//   res.send("ok");
// });

router.post('/', cors(), async function(req, res, next) {

  let user = await models.User.findOne({
    where: {
      eth_address: req.body.eth_address
    }
  });

  if (!user) {
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
   } else {
    res.send({ "error": `User with eth_address=${req.body.eth_address} already exist` });
  }
});

module.exports = router;
