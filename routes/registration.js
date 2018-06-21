const router         = require('express').Router();
const TokenGenerator = require('uuid-token-generator');
const con            = require('../index.js').con;
const SHA256         = require("crypto-js/sha256");

router.post('/', (req, res) => {
    if (req.body["email"] === undefined || req.body["username"] === undefined || req.body["password"] === undefined) {
        res.status(500).json({message: "Need all values in body. (email, username and password)."});
        return ;
    }
    con.query("SELECT id FROM users WHERE email=" + con.escape(req.body["email"]) + " OR name=" + con.escape(req.body["username"]))
    .then(result => {
        if (result[0].length == 0) {
            if (req.body["password"].length >= 8) {
                const passwd = SHA256(req.body["password"]);
                const date = new Date();
                con.query('INSERT INTO atlas.users(name,password,email,created_at) VALUES ('
                + con.escape(req.body["username"]) + ", "
                + con.escape(passwd.toString()) + " ,"
                + con.escape(req.body["email"]) + " ,"
                + con.escape(date) + ")")
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
