const router = require('express').Router();
const SHA256 = require('crypto-js/sha256');
const TokenGenerator = require('uuid-token-generator');
const nodemailer = require('nodemailer');
const config = require('config');
const path = require('path');

const { con } = require('../../../index.js');

const appDir = path.dirname(require.main.filename);
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
    const newPassword = tokgen.generate();
    await con.query(
      `UPDATE users SET password =${con.escape(SHA256(newPassword).toString())}` +
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
      from: email,
      to: 'arnaud.pinta@gmail.com',
      subject: '[ATLAS SUPPORT] Password reset',
      html: `<h1 style="color: #5e9ca0;">Atlas</h1>
        <h2 style="color: #2e6c80;">Forgot password ?</h2>
        <p>You are receiving this email because you requested a password reset. If not, please change your password as soon as possible and let us know.</p>
        <p>Here is your new password: <span style="background-color: #2e6c80; color: #fff; display: inline-block; padding: 3px 10px; font-weight: bold; border-radius: 5px;">${newPassword}</span>.</p>
        <p>Feel free to change it as soon as possible, using our website or our mobile app.</p>
        <p>Sincerely,<br /><br /><i>Atlas devs team</i><br /></p><br /><img src="cid:atlas_logo" width="200" height="200" /></p>`,
      attachments: [
        {
          filename: 'atlas_logo',
          path: `${appDir}/images/Logo_Title.png`,
          cid: 'atlas_logo'
        }
      ]
    };

    return smtpTransport.sendMail(mail, error => {
      smtpTransport.close();
      if (error) {
        res.status(401).json({ message: 'Error while sending the mail' });
      } else {
        res.status(200).json({ message: 'Success' });
      }
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
