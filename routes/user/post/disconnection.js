const router = require('express').Router();
const con = require('../../../index.js').con;

let hub = require('hub');

router.post('/', function(req, res) {
    const { api_token } = req.headers;

    if (api_token == null) {
        return res.status(400).json({message: "Bad parameters"});
    }
    if (hub.connectedUserToken[api_token] == null) {
        res.status(401);
        res.json({message: "Bad token"});
    } else {
        delete hub.connectedUserToken[api_token];
        res.status(200).json({message: "Disconnection success"});
    }
});

module.exports = router;