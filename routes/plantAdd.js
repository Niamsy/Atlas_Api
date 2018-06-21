const router = require('express').Router();
const con = require('../index.js').con;

let hub = require('hub');

router.post('/', function(req, res) {
    const api_token = req.header("api_token");
    const plantName = req.header("scientific_name");

    if (api_token == null || plantName == null) {
        res.status(400);
        res.json({message: "Bad parameters"});
        return;
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
                res.status(200);
                res.json({message: "Success"});
                return ;
            }).catch(err => {
                res.status(500);
                res.json({message: "Api encountered an issue: " + err});
                throw err;
            })
        }
        else {
            res.status(500);
            res.json({message: "Api encountered an issue"}); //TODO: Ce message et ce code d'erreur ne semble pas correct
        }
    }).catch(err => {
        res.status(500);
        res.json({message: "Api encountered an issue: " + err});
    })
});

module.exports = router;
