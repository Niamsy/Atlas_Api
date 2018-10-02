const router = require('express').Router();
const con    = require('../index.js').con;
const hub    = require('hub');

router.post('/', (req, res) => {
    const token = req.header('api_token');

    if (req.body["name"] == null ||
        req.body["scientific_name"] == null ||
        req.body["max_height"] == null ||
        req.body["ids_soil_ph"] == null ||
        req.body["ids_soil_type"] == null ||
        req.body["ids_sun_exposure"] == null ||
        req.body["ids_soil_humidity"] == null ||
        req.body["ids_reproduction"] == null ||
        req.body["ids_plant_container"] == null ||
        req.body["planting_period"] == null ||
        req.body["florering_period"] == null ||
        req.body["harvest_period"] == null ||
        req.body["cutting_period"] == null ||
        req.body["fk_id_frozen_tolerance"] == null ||
        req.body["fk_id_growth_rate"] == null ||
        req.body["growth_duration"] == null)
    {
        res.status(400).json({
            message: "Body values are incorrect"
        });
    }
    else if (token == null || hub.connectedUserToken[token] == null)
    {
        res.status(401).json({ message: "API token is invalid" });
    }
    else {
        con.query("SELECT rights.name FROM rights INNER JOIN users ON users.right_id = rights.id WHERE users.id = '" + hub.connectedUserToken[token] + "'").then(result => {
            if (result[0].length == 0 || result[0][0]['name'] != "admin")
            {
                res.status(402).json({ message: "The API Token doesn't belong to a admin", result : result[0] });
                return;
            }
            con.query("SELECT id from plants where scientific_name = " + con.escape(req.body["scientific_name"])).then(result => {
                if (result[0].length == 0)
                {
                    const str_query = "INSERT INTO plants "
                            + "(name, scientific_name, maxheight, ids_soil_ph, ids_soil_type, ids_sun_exposure, "
                            + "ids_soil_humidity, ids_reproduction, ids_plant_container, planting_period, "
                            + "florering_period, harvest_period, cutting_period, fk_id_frozen_tolerance, "
                            + "fk_id_growth_rate, growth_duration) "
                            + " VALUES (" + con.escape(req.body["name"])
                            + ", " + con.escape(req.body["scientific_name"])
                            + ", " + (req.body["max_height"])
                            + ", " + con.escape(req.body["ids_soil_ph"])
                            + ", " + con.escape(req.body["ids_soil_type"])
                            + ", " + con.escape(req.body["ids_sun_exposure"])
                            + ", " + con.escape(req.body["ids_soil_humidity"])
                            + ", " + con.escape(req.body["ids_reproduction"])
                            + ", " + con.escape(req.body["ids_plant_container"])
                            + ", " + con.escape(req.body["planting_period"])
                            + ", " + con.escape(req.body["florering_period"])
                            + ", " + con.escape(req.body["harvest_period"])
                            + ", " + con.escape(req.body["cutting_period"])
                            + ", " + (req.body["fk_id_frozen_tolerance"])
                            + ", " + (req.body["fk_id_growth_rate"])
                            + ", " + (req.body["growth_duration"])
                            + ");";
                    con.query(str_query).then(result =>
                    {
                        res.status(201).json({ message: "Plant created" });
                        return;
                    }).catch(e => res.status(500).json({ message: "Atlas API Encountered a issue"}));
                }
                else
                    res.status(403).json({ message: "Plant already exist" });
            }).catch(e => res.status(500).json({ message: "Atlas API Encountered a issue."}));
        }).catch(e => res.status(500).json({ message: "Atlas API Encountered a issue." }));
    }
});

module.exports = router;
