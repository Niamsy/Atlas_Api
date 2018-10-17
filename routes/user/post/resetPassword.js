const router = require('express').Router();
const SHA256 = require('crypto-js/sha256');
const TokenGenerator = require('uuid-token-generator');
const nodemailer = require('nodemailer');
const config = require('config');
const { con } = require('../../../index.js');

const tokgen = new TokenGenerator();

router.post('/', async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Body values are incorrect.' });
  }
  try {
    const resu = await con.query(`SELECT * FROM users WHERE email =${con.escape(email)}`);
    if (resu[0].length === 0) {
      return res.status(401).json({ message: `${email} is linked to nobody` });
    }
    const new_password = tokgen.generate();
    await con.query(
      `UPDATE users SET password =${con.escape(SHA256(new_password).toString())}` +
        ` WHERE email=${con.escape(email)}`
    );
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
  } catch (err) {
    next(err);
  }
});

module.exports = router;
