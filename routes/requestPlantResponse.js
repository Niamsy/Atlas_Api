const router         = require('express').Router();
const con            = require('../index.js').con;
const hub            = require('hub');

router.post('/', (req, res) =>
{
    const body = req.body;
    const api_token = req.header("api_token");
    
    if (body["id_request"] === undefined || body["status"] === undefined)
    {
        res.status(400);
        res.json({ message: "Body values are incorrect" });
        return;
    }

    const id_request = con.escape(body["id_request"]);

    if (api_token === undefined || hub.connectedUserToken[api_token] === undefined)
    {
        res.status(401);
        res.json({ message: "API token is invalid or empty" });
        return;
    }
    
    con.query("SELECT rights.name FROM rights INNER JOIN users ON users.right_id = rights.id WHERE users.id = '" + hub.connectedUserToken[token] + "'").then(result =>
    {
        if (result[0].length == 0 || result[0][0]['name'] != "admin")
        {
            res.status(402).json({ message: "The API Token doesn't belong to a admin", result : result[0] });
            return;
        }
        con.query("SELECT id FROM plant_requests WHERE id = " + id_request).then(result =>
        {
            if (result[0].length == 0)
            {
                status(403).json({ message: "No request with the given request_id exist" });
                return;
            }
            
            const new_status = ((body["status"] == true) ? (2) : (3));
            con.query("UPDATE plant_requests SET status = " + new_status + " WHERE id = " + id_request).then(result =>
            {
                status(200).json({ message: "Success" });
            }).catch(err => { res.status(500).json({ message: "Atlas API encountered a issue", err: query_str }); throw err })
        }).catch(err => { res.status(500).json({ message: "Atlas API encountered a issue", err: query_str }); throw err })
    }).catch(err => { res.status(500).json({ message: "Atlas API encountered a issue", err: query_str }); throw err })
});

module.exports = router;
