/* eslint-disable no-else-return */
const router = require('express').Router();
const SHA256 = require('crypto-js/sha256');

const hub = require('hub');
const { con } = require('../../../index.js');

router.post('/', async (req, res, next) => {
  const { old_password, new_password } = req.body;
  const { api_token } = req.headers;

  if (!old_password || !new_password) {
    res.status(400).json({ message: 'Header values are incorrect.' });
  }
  try {
    const resu = await con.query(
      `SELECT * FROM users
          WHERE password =${con.escape(SHA256(old_password).toString())}
          AND id=${hub.connectedUserToken[api_token]}`
    );
    if (resu[0].length === 0) {
      return res.status(400).json({ message: 'Wrong password.' });
    } else if (new_password.length < 8) {
      return res.status(400).json({ message: 'Password needs to get more than 8 characters.' });
    }
    await con.query(
      `UPDATE users SET password =${con.escape(SHA256(new_password).toString())}
        WHERE password=${con.escape(SHA256(old_password).toString())}
        AND id=${hub.connectedUserToken[api_token]}`
    );
    return res.status(200).json({ message: 'Success' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
