const router = require('express').Router();
const con = require('../index.js').con;

let hub = require('hub');

router.post('/', function(req, res) {
  if (req.headers['api_token'] === undefined || req.headers['username'] === undefined) {
    res.status(400).json({message: 'Need all values in header. (username, api_token).'});
  } else if (hub.connectedUserToken === undefined || hub.connectedUserToken[req.headers['api_token']] === undefined) {
      res.status(401).json({message: 'Api token is wrong.'});
  } else {
    con.query('SELECT rights.name FROM rights, users WHERE rights.id = users.right_id AND users.name = ' + con.escape(req.headers['username']))
    .then(result => {
      if (result[0].length > 0) {
        res.status(200).json({isAdmin: result[0].name === 'admin'});
      } else {
        res.status(500).json({message: 'No user with username : ' + req.headers['username']})
      }
    }).catch(err => {
      res.status(500).json({message: 'Internal server error'});
      throw err;
    });
  }
});

module.exports = router;
