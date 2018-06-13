const router = require('express').Router();
var hub      = require('hub');

router.post('/', function(req, res) {
    const api_token = req.header("api_token");
    const plantName = req.header("scientific_name");

    if (api_token == null || plantName == null) {
        res.status(400).send("Bad parameters");
        return;
    }
    if (hub.connectedUserToken[api_token] == null) {
        res.status(401).send("Api token is wrong");
        return;
    }
    con.query("SELECT * from plants where scientific_name = \'" + plantName + "\'").then(result => {
        if (result[0].length > 0) {
            const plant_id = result[0].id;
            const date = new Date();
            con.query("INSERT INTO users_plants (fk_id_user, fk_id_plant, scanned_at) VALUES ("
            + hub.connectedUserToken[api_token] + ", " + plant_id +", "
            + con.escape(date) + ")").then(result => {
                res.status(200).send("Success.")
                return ;
            }).catch(err => {
                res.status(500).send("API error.")
                throw err;
            })
        }
        else {
            res.status(500).send("API error.")
        }
    }).catch(err => {
        res.status(500).send("API error.");
        throw err;
    })
});

module.exports = router;
