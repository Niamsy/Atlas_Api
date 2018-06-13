const router = require('express').Router();
var hub      = require('hub');

function generateToken() {
    var api_token = tokgen.generate();
    if (hub.connectedUserToken[api_token] != null) {
        return generateToken();
    }
    return api_token;
};

router.post('/', function(req, res) {
    let username = req.header("username");
    let password = req.header("password");

    if (username == null || password == null) {
        res.status(400).send("Header values are incorrect");
    }
    con.query("SELECT id, name, password FROM users WHERE name = \'"
    + username + "\' and password =\'" + SHA256(password) + "\'").then(result => {
        if (result[0].length == 0) {
            res.status(400).send("Bad authentification");
            return;
        }
        for (let key in hub.connectedUserToken) {
            if (key == result[0][0].id) {
                res.status(200).send(JSON.stringify({ api_token: key }));
                return;
            }
        }
        const api_token = generateToken();
        res.status(200).send(JSON.stringify({ api_token: api_token }));
        hub.connectedUserToken[api_token] = result[0][0].id;
        con.query("UPDATE users SET last_connection_at = " + con.escape(new Date())
        + " WHERE id = \'" + hub.connectedUserToken[api_token] + "\'").then(result => {})
        .catch(err => {
            throw err;
        });
    }).catch(err => {
        res.status(500).send("API error.");
        throw err;
    });
});

module.exports = router;
