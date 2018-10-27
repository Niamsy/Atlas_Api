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
  }
  try {
    const resu = await con.query(
      `SELECT * FROM users
          WHERE password =${con.escape(SHA256(oldPassword).toString())}
          AND id=${hub.connectedUserToken[apiToken]}`
    );
    if (resu[0].length === 0) {
      return res.status(400).json({ message: 'Wrong password.' });
    } else if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password needs to get more than 8 characters.' });
    }
    await con.query(
      `UPDATE users SET password =${con.escape(SHA256(newPassword).toString())}
        WHERE password=${con.escape(SHA256(oldPassword).toString())}
        AND id=${hub.connectedUserToken[apiToken]}`
    );
    return res.status(200).json({ message: 'Success' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
