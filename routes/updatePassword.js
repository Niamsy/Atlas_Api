const router = require('express').Router();
const con    = require('../index.js').con;
const SHA256 = require("crypto-js/sha256");

let hub      = require('hub');

router.post('/', (req, res) => {
    const b = req.body;

    if (!b['api_token'] || !b['old_password'] || !b['new_password']) {
        res.status(400).json({message: "Header values are incorrect"});
    } else if (hub.connectedUserToken === undefined || hub.connectedUserToken[b["api_token"]] === undefined) {
        res.status(401).json({message: "Api token is wrong"});
    } else {
      con.query("SELECT * from users WHERE password=" + con.escape(SHA256(b.old_password).toString()))
      .then(resu => {
        if (resu[0].length == 0) {
          res.status(400).json({message: "wrong password"});
        } else if (b['new_password'].length < 8) {
          res.status(400).json({message: "password need to have at least 8 characters"});
        } else {
          con.query("UPDATE users SET password=" + con.escape(SHA256(b.new_password).toString())
          + " WHERE password=" + con.escape(SHA256(b.old_password).toString())).then(resu => {
            res.status(200).json({message: "success"});
          }).catch(e => {
            res.status(500).json({message: "server error"});
          });
        }
      }).catch(e => {
        res.status(500).json({message: "server error"});
      });
    }
});

module.exports = router;
