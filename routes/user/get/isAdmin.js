const router = require('express').Router();
const con = require('../../../index.js').con;

let hub = require('hub');

router.get('/', function (req, res) {
  const {api_token} = req.headers;

  con.query(`SELECT rights.name
             FROM rights,
                  users WHERE rights.id = users.right_id
                          AND users.id = ${hub.connectedUserToken[api_token]}`)
    .then(result => {
      if (result[0].length > 0) {
        res.status(200).json({isAdmin: (result[0][0]['name'] === 'admin')});
      } else {
        res.status(500).json({message: 'Internal server error: Unknown user'});
      }
    }).catch(err => {
    return res.status(500).json({message: 'Internal server error:' + err});
  });
});

module.exports = router;
