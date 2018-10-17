const router = require('express').Router();
const SHA256 = require('crypto-js/sha256');
const TokenGenerator = require('uuid-token-generator');
const nodemailer = require('nodemailer');
const config = require('config');
const con = require('../../../index.js').con;

const tokgen = new TokenGenerator();

router.post('/', (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: 'Body values are incorrect.' });
  } else {
    con
      .query(
        `SELECT *
               FROM users WHERE email =${con.escape(email)}`
      )
      .then(resu => {
        if (resu[0].length === 0) {
          return res.status(401).json({ message: `${email} is linked to nobody` });
        }
        const new_password = tokgen.generate();
        con
          .query(
            `UPDATE users SET password =${con.escape(SHA256(new_password).toString())}` +
              ` WHERE email=${con.escape(email)}`
          )
          .then(() => {
            const smtpTransport = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: config.email,
                pass: config.password_gmail
              }
            });

            const mail = {
              from: config.email,
              to: email,
              subject: 'reset password account',
              html: `Your new password is : ${new_password}<br \>Change it as soon as possible`
            };

            smtpTransport.sendMail(mail, error => {
              if (error) {
                res.status(401).json({ message: 'Error while sending the mail' });
              } else {
                res.status(200).json({ message: 'Success' });
              }
              smtpTransport.close();
            });
          })
          .catch(() => res.status(500).json({ message: 'Internal server error' }));
      });
  }
});

module.exports = router;
