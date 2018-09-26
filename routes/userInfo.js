const router = require('express').Router();
const con    = require('../index.js').con;

const hub    = require('hub');

router.get('/', (req, res) => {
  const api_token = req.headers["api_token"];
  if (api_token === undefined) {
    res.status(400).json({message: "Need all values in header (api_token)."});
  } else if (hub.connectedUserToken === undefined || hub.connectedUserToken[api_token] === undefined) {
      res.status(401).json({message: "Api token is wrong"});
  } else {
    con.query("SELECT name, email, created_at, last_connection_at, right_id FROM users WHERE id=" +  hub.connectedUserToken[api_token])
    .then(result => {
      if (result[0].length > 0) {
        res.status(200).json(result[0][0]);
      } else {
        res.status(500).json({message: "Internal server error"});
      }
    }).catch(err => { res.status(500).json({message: "Internal server error"}); throw err })
  }
});

module.exports = router;
