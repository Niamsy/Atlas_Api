const router         = require('express').Router();
const TokenGenerator = require('uuid-token-generator');
const con            = require('../../../index').con;
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
    const { username, password } = req.headers;

    if (username === undefined || password === undefined) {
        return res.status(400).json({message: "Header values are incorrect"});
    }
    con.query("SELECT id, name, password FROM users WHERE name = \'"
    + username + "\' and password =\'" + SHA256(password) + "\'").then(result => {
        if (result[0].length === 0) {
            return res.status(400).json({message: "Bad authentication"});
        }
        for (let key in hub.connectedUserToken) {
            if (key === result[0][0].id) {
                return res.status(200).json({ api_token: key });
            }
        }
        const api_token = generateToken();
        hub.connectedUserToken[api_token] = result[0][0].id;
        con.query("UPDATE users SET last_connection_at = " + con.escape(new Date())
        + " WHERE id = \'" + hub.connectedUserToken[api_token] + "\'").then(result => {})
        .catch(err => {
            throw err;
        });
        return res.status(200).json({ api_token: api_token });
    }).catch(err => {
        return res.status(500).json({message: "Api encountered an issue: " + err});
    });
});

module.exports = router;
