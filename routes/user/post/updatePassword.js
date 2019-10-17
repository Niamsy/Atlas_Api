/* eslint-disable no-else-return */
const router = require('express').Router();
const SHA256 = require('crypto-js/sha256');

const hub = require('hub');
const { con } = require('../../../index.js');

router.post('/', async (req, res, next) => {
  const { old_password: oldPassword, new_password: newPassword } = req.body;
  const { api_token: apiToken } = req.headers;

  if (!oldPassword || !newPassword) {
    res.status(400).json({ message: 'Header values are incorrect.' });
    return;
  }
  try {
    const resu = await con.query(
      `SELECT * FROM users
          WHERE password =${con.escape(SHA256(oldPassword).toString())}
          AND id=${hub.connectedUserToken[apiToken]}`
    );
    if (resu[0].length === 0) {
      res.status(400).json({ message: 'Wrong password.' });
      return;
    } else if (newPassword.length < 8) {
      res.status(400).json({ message: 'Password needs to get more than 8 characters.' });
      return;
    } else if (!/[0-9]+/.test(newPassword) || !/[,?;.:/!$*^&~"#'{(\[-|_\\@)\]=+}]/.test(newPassword)) {
      res.status(400).json({ message: 'Password needs to contain at least one number and one special character.' });
      return;
    }
    await con.query(
      `UPDATE users SET password =${con.escape(SHA256(newPassword).toString())}
        WHERE password=${con.escape(SHA256(oldPassword).toString())}
        AND id=${hub.connectedUserToken[apiToken]}`
    );
    res.status(200).json({ message: 'Success' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
