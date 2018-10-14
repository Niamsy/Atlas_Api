const router = require('express').Router();
const con = require('../../../index.js').con;
const SHA256 = require('crypto-js/sha256');

let hub = require('hub');

router.post('/', (req, res) => {
  const { old_password, new_password } = req.body;
  const { api_token } = req.headers;

  if (!old_password || !new_password) {
    res.status(400).json({ message: 'Header values are incorrect.' });
  } else {
    con
      .query(
        `SELECT * FROM users
          WHERE password =${con.escape(SHA256(old_password).toString())}
          AND id=${hub.connectedUserToken[api_token]}`
      )
      .then(resu => {
        if (resu[0].length === 0) {
          res.status(400).json({ message: 'Wrong password.' });
        } else if (new_password.length < 8) {
          res.status(400).json({ message: 'Password needs to get more than 8 characters.' });
        } else {
          con
            .query(
              `UPDATE users SET password =${con.escape(SHA256(new_password).toString())}
                WHERE password=${con.escape(SHA256(old_password).toString())}
                AND id=${hub.connectedUserToken[api_token]}`
            )
            .then(() => {
              res.status(200).json({ message: 'Success' });
            })
            .catch(() => {
              res.status(500).json({ message: 'Internal server error' });
            });
        }
      })
      .catch(e => {
        res.status(500).json({ message: 'Internal server error' });
      });
  }
});

module.exports = router;
