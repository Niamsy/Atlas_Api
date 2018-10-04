const router         = require('express').Router();
const TokenGenerator = require('uuid-token-generator');
const con            = require('../index.js').con;
const SHA256         = require("crypto-js/sha256");
const hub            = require('hub');

router.get('/', (req, res) =>
{
    const api_token = req.header("api_token");

    if (req.header("request_id") === undefined)
    {
        res.status(400);
        res.json({ message: "Body values are incorrect" });
        return;
    }
    if (api_token === undefined || hub.connectedUserToken[api_token] === undefined)
    {
        res.status(401);
        res.json({ message: "API token is invalid or empty" });
        return;
    }
    const id_request = con.escape(req.header("request_id"));

    const query_str = "SELECT * " +
                      "FROM plant_requests " +
                      "WHERE id = " + id_request + " AND fk_id_user = " + con.escape(hub.connectedUserToken[api_token]);

    con.query(query_str)
    .then(result => {
        if (result[0].length == 0)
            res.status(402).json({ message: "No such request linked to this user" });
        else
            res.status(200).json({ message: "Sucess", result: result[0][0] });
    }).catch(err => { res.status(500).json({ message: "Atlas API encountered a issue", err: query_str }); throw err })
});

module.exports = router;
