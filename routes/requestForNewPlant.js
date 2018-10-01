const router         = require('express').Router();
const TokenGenerator = require('uuid-token-generator');
const con            = require('../index.js').con;
const SHA256         = require("crypto-js/sha256");

router.post('/', (req, res) => {
    const body = req.body;
    const api_token = req.header("api_token");

 
    if (api_token == null || hub.connectedUserToken[api_token] == null)
    {
        res.status(401);
        res.json({message: "Api token is wrong"});
        return;
    }

    con.query("SELECT id FROM users WHERE email=" + con.escape(req.body["email"]) + " OR name=" + con.escape(req.body["username"]))
    .then(result => {
        if (result[0].length == 0) {
            if (req.body["password"].length >= 8) {
                const passwd = SHA256(req.body["password"]);
                const date = new Date();
                con.query('INSERT INTO users(name,password,email,created_at, right_id) VALUES ('
                + con.escape(req.body["username"]) + ", "
                + con.escape(passwd.toString()) + " ,"
                + con.escape(req.body["email"]) + " ,"
                + con.escape(date) + ", 2)")
                .then(result => {
                    res.json({message: "Success"});
                }).catch(err => { throw err })
            } else {
                res.status(400).json({message: "Password need to get more than 8 characters."});
            }
        } else {
            res.status(401).json({message: "Already in use!"});
        }
    }).catch(err => { res.status(500).json({message: "Internal server error"}); throw err })
});

module.exports = router;
