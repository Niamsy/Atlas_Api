const router = require('express').Router();
const con    = require('../index.js').con;
const hub    = require('hub');


router.get('/', (req, res) => {
    const api_token = req.headers["api_token"];
    if (api_token === undefined) {
        res.status(400).json({message: "Need all values in header (api_token)."});
    } else if (hub.connectedUserToken === undefined || hub.connectedUserToken[api_token] === undefined) {
        res.status(401).json({message: "Api token is wrong"});
    } else {
        con.query("SELECT plants.name, plants.scientific_name FROM plants INNER JOIN users_plants ON plants.id=users_plants.fk_id_plant" +
        " where fk_id_user="+ hub.connectedUserToken[api_token]+ "  GROUP BY plants.name")
        .then(result => {
            if (result[0].length > 0) {
                console.log(result)
                res.status(200).json(result[0][0]);
            } else {
                res.status(500).json({message: "Internal server error"});
            }
        }).catch(err => { res.status(500).json({message: "Internal server error"}); throw err })
    }
});

module.exports = router;
