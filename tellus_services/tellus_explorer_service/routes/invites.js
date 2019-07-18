var express = require('express');
var router = express.Router();

const cors = require('cors');

const send_invitation = require('../mailer/mailer').send_invitation;

router.get('/send_invitation', cors(), function(req, res, next) {
  let inviter_name = req.query.inviter_name || process.env["DEFAULT_INVITER_NAME"];
  send_invitation(inviter_name, req.query.mail_to).then(function (result) {
    res.send({ result });
  }).catch(function(error) {
    res.send({ error });
  });
});

module.exports = router;
