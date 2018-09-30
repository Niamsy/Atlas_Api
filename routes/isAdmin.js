const router = require('express').Router();
const con = require('../index.js').con;

let hub = require('hub');

router.get('/', function(req, res) {
  const api_token = req.headers['api_token'];
  if (api_token === undefined) {
    res.status(400).json({message: 'Need all values in header (api_token).'});
  } else if (hub.connectedUserToken === undefined || hub.connectedUserToken[api_token] === undefined) {
      res.status(401).json({message: 'Api token is wrong.'});
  } else {
    con.query('SELECT rights.name FROM rights, users WHERE rights.id = users.right_id AND users.id = ' + hub.connectedUserToken[api_token])
    .then(result => {
      if (result[0].length > 0) {
        res.status(200).json({isAdmin: (result[0][0]['name'] == 'admin')});
      } else {
        res.status(500).json({message: 'Internal server error: Unknown user'});
      }
    }).catch(err => {
      res.status(500).json({message: 'Internal server error:' + err});
      throw err;
    });
  }
});

module.exports = router;
