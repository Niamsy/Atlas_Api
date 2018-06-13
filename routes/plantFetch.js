const router = require('express').Router();
var hub      = require('hub');


router.get('/', (req, res) => {
    const token = req.header('api_token');

    if (!token) {
        res.status(400).send("Header values are incorrect");
    } else if (hub.connectedUserToken[token] == null) {
        res.status(401).send("Api token is wrong");
    } else {
        con.query("SELECT plants.name, plants.scientific_name, plants.maxheight, plants.ids_reproduction, plants.ids_soil_type, plants.ids_soil_ph, plants.ids_soil_humididty, " +
        "plants.ids_sun_exposure, plants.ids_plant_container, plants.planting_period, plants.florering_period, " +
        "plants.harvest_period, plants.harvest_period, plants.cutting_period, plants.fk_id_frozen_tolerance," +
        " plants.fk_id_growth_rate, scanned_at FROM plants INNER JOIN users_plants ON plants.id=users_plants.fk_id_plant" +
        " where fk_id_user="+ hub.connectedUserToken[token]).then(result => {
            res.status(200).send(result[0]);
        }).catch(err => {
            res.status(500).send("Api encountered an issue");
            throw err;
        })
    }
});

module.exports = router;
