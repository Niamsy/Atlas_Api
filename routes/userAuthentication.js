const router         = require('express').Router();
const TokenGenerator = require('uuid-token-generator');
const con            = require('../index.js').con;
const SHA256         = require("crypto-js/sha256");

let hub              = require('hub');

const tokgen = new TokenGenerator();

function generateToken() {
    const api_token = tokgen.generate();
    if (hub.connectedUserToken[api_token] != null) {
        return generateToken();
    }
    return api_token;
};

router.post('/', function(req, res) {
    let username = req.header("username");
    let password = req.header("password");

    if (username == null || password == null) {
        res.status(400);
        res.json({message: "Header values are incorrect"});
        return;
    }
    con.query("SELECT id, name, password FROM users WHERE name = \'"
    + username + "\' and password =\'" + SHA256(password) + "\'").then(result => {
        if (result[0].length == 0) {
            res.status(400);
            res.json({message: "Bad authentication"});
            return;
        }
        for (let key in hub.connectedUserToken) {
            if (key == result[0][0].id) {
                res.status(200);
                res.json({ api_token: key });
                return;
            }
        }
        const api_token = generateToken();
        hub.connectedUserToken[api_token] = result[0][0].id;
        con.query("UPDATE users SET last_connection_at = " + con.escape(new Date())
        + " WHERE id = \'" + hub.connectedUserToken[api_token] + "\'").then(result => {})
        .catch(err => {
            throw err;
        });
        res.status(200);
        res.json({ api_token: api_token });
    }).catch(err => {
        res.status(500);
        res.json({message: "Api encountered an issue: " + err});
        return;
    });
});

module.exports = router;
