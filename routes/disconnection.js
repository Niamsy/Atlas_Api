const router = require('express').Router();
const con = require('../index.js').con;

let hub = require('hub');

router.post('/', function(req, res) {
    const api_token = req.header("api_token");
    console.log('before')
    console.log(hub.connectedUserToken)
    if (api_token == null) {
        res.status(400);
        res.json({message: "Bad parameters"});
        return;
    }
    if (hub.connectedUserToken[api_token] == null) {
        res.status(401);
        res.json({message: "Bad token"});
        return;
    } else {
        delete hub.connectedUserToken[api_token]
        res.status(200);
        res.json({message: "Disconnection success"});
    }
    console.log('after')
    console.log(hub.connectedUserToken)
});

module.exports = router;
