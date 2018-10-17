const router = require('express').Router();

const hub = require('hub');
const { con } = require('../../../index.js');

router.get('/', (req, res) => {
  const { api_token } = req.headers;

  con
    .query(
      `SELECT name, email, created_at, last_connection_at, right_id FROM users WHERE id=${
        hub.connectedUserToken[api_token]
      }`
    )
    .then(result => {
      if (result[0].length > 0) {
        res.status(200).json(result[0][0]);
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Internal server error' });
      throw err;
    });
});

module.exports = router;
