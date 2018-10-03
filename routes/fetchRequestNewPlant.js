const router = require('express').Router();
const con    = require('../index.js').con;

let hub      = require('hub');

router.get('/', (req, res) =>{
    const token = req.header('api_token');

    if (token == null)
        res.status(400).json({message: "Header values are incorrect"});
    else if (hub.connectedUserToken[token] === undefined)
        res.status(401).json({message: "API token is wrong"});
    else
    {
        const id = hub.connectedUserToken[token];
        con.query("SELECT * FROM plant_requests WHERE fk_id_user = " + id)
            .then(result => {
            res.status(200);
            res.json(result[0]);
        }).catch(err => {
            res.status(500);
            res.json({ message: "API encountered an issue: +" + err });
        })
    }
});

module.exports = router;
