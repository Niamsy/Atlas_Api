const router = require('express').Router();
const con = require('../../../index.js').con;

let hub = require('hub');

router.post('/', function(req, res) {
    const { api_token, scientific_name: plantName } = req.headers;

    if (api_token == null || plantName == null) {
        return res.status(400).json({message: "Bad parameters"});
    }
    if (hub.connectedUserToken[api_token] == null) {
        res.status(401);
        res.json({message: "Api token is wrong"});
        return;
    }
    con.query("SELECT * from plants where scientific_name = \'" + plantName + "\'").then(result => {
        if (result[0].length > 0) {
            const plant_id = result[0].id;
            const date = new Date();
            con.query("INSERT INTO users_plants (fk_id_user, fk_id_plant, scanned_at) VALUES ("
            + hub.connectedUserToken[api_token] + ", " + plant_id +", "
            + con.escape(date) + ")").then(result => {
                return res.status(200).json({message: "Success"});
            }).catch(err => {
                return res.status(500).json({message: "Api encountered an issue: " + err});
            })
        } else {
            return res.status(404).json({message: "Plant not found"});
        }
    }).catch(err => {
        return res.status(500).json({message: "Api encountered an issue: " + err});
    })
});

module.exports = router;
