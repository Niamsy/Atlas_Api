const router = require('express').Router();
const SHA256 = require('crypto-js/sha256');
const { con } = require('../../../index.js');

router.post('/', (req, res) => {
  const { email, username, password } = req.body;

  if (email === undefined || username === undefined || password === undefined) {
    return res.status(500).json({
      message: 'Need all values in body. (email, username and password).'
    });
  }
  con
    .query(`SELECT id FROM users WHERE email=${con.escape(email)} OR name=${con.escape(username)}`)
    .then(result => {
      if (result[0].length === 0) {
        if (password.length >= 8) {
          const passwd = SHA256(password);
          const date = new Date();
          con
            .query(
              `INSERT INTO users(name, password, email, created_at, right_id) VALUES (
              ${con.escape(username)}, ${con.escape(passwd.toString())}, ${con.escape(
                email
              )}, ${con.escape(date)}, 2)`
            )
            .then(() => {
              res.json({ message: 'Success' });
            })
            .catch(err => {
              throw err;
            });
        } else {
          res.status(400).json({ message: 'Password need to get more than 8 characters.' });
        }
      } else {
        res.status(401).json({ message: 'Already in use!' });
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'Internal server error' });
    });
});

module.exports = router;
