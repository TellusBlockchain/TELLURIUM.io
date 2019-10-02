"use strict";

const nodemailer = require("nodemailer");
const crypto = require('crypto');
const Email = require('email-templates');

exports.send_invitation = async function (inviter_name, mail_to) {
  let transporter;

  if (process.env["TEST_MAILER"] === '1') {
    let testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  } else {
    transporter = nodemailer.createTransport({
      host: process.env["MAILER_HOST"],
      port: 465,
      secure: true,
      auth: {
        user: process.env["MAILER_USER"],
        pass: process.env["MAILER_PASSWORD"]
      }
    });
  }

  let hash = crypto.createHash('md5').update(mail_to + '_' + process.env["INVITES_SECRET"]).digest('hex');
  let href = `${process.env["BASE_URL"]}/registry_entities/index?email=${mail_to}&token=${hash}`;

  const email = new Email({ views: { options: { extension: 'ejs' } } });
  let emailRender = await email.renderAll('invitation', { href });

  let result = await transporter.sendMail({
    from:    `"${inviter_name}" <${process.env["MAILER_NOREPLY"]}>`,
    to:      mail_to,
    subject: emailRender.subject,
    text:    emailRender.text,
    html:    emailRender.html
  });

  if (process.env["TEST_MAILER"] === '1') {
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
    result.preview_url = nodemailer.getTestMessageUrl(result);
  }

  return result;
};