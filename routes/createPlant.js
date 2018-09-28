const router = require('express').Router();
const con    = require('../index.js').con;
const hub    = require('hub');

router.post('/', (req, res) => {
    let b = req.body;
    if (b.api_token == null || b.name == null || b.scientific_name == null || b.maxheight == null
      || b.ids_soil_ph == null || b.ids_soil_type == null || b.ids_sun_exposure == null
      || b.ids_soil_humidity == null || b.ids_reproduction == null || b.ids_plant_container == null
      || b.planting_period == null || b.florering_period == null || b.harvest_period == null
      || b.cutting_period == null || b.fk_id_frozen_tolerance == null || b.fk_id_growth_rate == null) {
        res.status(400).json({ message: "Header values are incorrect." });
    }
    else if (hub.connectedUserToken[b.api_token] == null) {
        res.status(401).json({ message: "API token is invalid." });
    }
    else {
        con.query("SELECT rights.name FROM rights INNER JOIN users ON users.right_id = rights.id WHERE users.id = '" + con.escape(b.scientific_name) + "'").then(result => {
            if (result[0].length == 0 || result[0] != "admin")
            {
                res.status(402).json({ message: "The API Token doesn't belong to a admin." });
                return;v
            }
            con.query("SELECT id from plants where scientific_name = \'" + con.escape(b.scientific_name) + "\'").then(result => {
                if (result[0].length == 0)
                {
                    con.query("INSERT INTO plants VALUES (" + con.escape(b.name) + ", " + con.escape(b.scientific_name)
                            + ", " + con.escape(b.maxheight) + ", " + con.escape(b.ids_soil_ph) + ", " + con.escape(b.ids_soil_type)
                            + ", " + con.escape(b.ids_sun_exposure) + ", " + con.escape(b.ids_soil_humidity)
                            + ", " + con.escape(b.ids_reproduction) + ", " + con.escape(b.ids_plant_container)
                            + ", " + con.escape(b.planting_period) + ", " + con.escape(b.florering_period)
                            + ", " + con.escape(b.harvest_period) + ", " + con.escape(b.cutting_period)
                            + ", " + con.escape(b.fk_id_frozen_tolerance) + ", " + con.escape(b.fk_id_growth_rate) + ")").then(res =>{
                    res.status(200).json({ message: "Plant created" });
                            }).catch(e => res.status(500).json({ message: "Atlas API Encountered a issue" }));
                }
                else
                    res.status(403).json({ message: "Plant already exist." });
            }).catch(e => res.status(500).json({ message: "Atlas API Encountered a issue." }));
        }).catch(e => res.status(500).json({ message: "Atlas API Encountered a issue." }));
    }
});

module.exports = router;
