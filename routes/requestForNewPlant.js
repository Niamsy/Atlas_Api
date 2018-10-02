const router         = require('express').Router();
const TokenGenerator = require('uuid-token-generator');
const con            = require('../index.js').con;
const SHA256         = require("crypto-js/sha256");
const hub            = require('hub');

router.post('/', (req, res) =>
{
    const body = req.body;
    const api_token = req.header("api_token");

    if (api_token == null || hub.connectedUserToken[api_token] == null) {
        res.status(401);
        res.json({ message: "API token is invalid or empty" });
        return;
    }
    if (body["name"] == null || body["scientific_name"] == null || body["max_height"] == null
         || body["ids_reproduction"] == null || body["ids_soil_type"] == null || body["ids_soil_ph"] == null
         || body["ids_soil_humidity"] == null || body["ids_sun_exposure"] == null || body["ids_plant_container"] == null
         || body["planting_period"] == null || body["florering_period"] == null || body["harvest_period"] == null
         || body["fk_id_frozen_tolerance"] == null || body["fk_id_growth_rate"] == null || body["growth_duration"] == null) {
        res.status(400);
        res.json({ message: "Body values are incorrect" });
        return;
    }

    const name                      = con.escape(body["name"]);
    const scientific_name           = con.escape(body["scientific_name"]);
    const max_height                = body["max_height"];
    const ids_reproduction          = con.escape(body["ids_reproduction"]);
    const ids_soil_type             = con.escape(body["ids_soil_type"]);
    const ids_soil_ph               = con.escape(body["ids_soil_ph"]);
    const ids_soil_humidity         = con.escape(body["ids_soil_humidity"]);
    const ids_sun_exposure          = con.escape(body["ids_sun_exposure"]);
    const ids_plant_container       = con.escape(body["ids_plant_container"]);
    const planting_period           = con.escape(body["planting_period"]);
    const florering_period          = con.escape(body["florering_period"]);
    const harvest_period            = con.escape(body["harvest_period"]);
    const fk_id_frozen_tolerance    = body["fk_id_frozen_tolerance"];
    const fk_id_growth_rate         = body["fk_id_growth_rate"];
    const growth_duration           = body["growth_duration"];

    con.query("SELECT name FROM plant_requests WHERE name = " + name)
    .then(result => {
        if (result[0].length == 0)
        {
            const query_str = "INSERT INTO plant_requests(fk_id_user," +
                      "name, scientific_name, max_height, ids_reproduction, " +
                      "ids_soil_type, ids_soil_ph, ids_soil_humidity, " +
                      "ids_sun_exposure, ids_plant_container, planting_period, " +
                      "florering_period, harvest_period, fk_id_frozen_tolerance, " +
                      "fk_id_growth_rate, growth_duration, " +
                      "status, created_at) VALUES (" +
                      + hub.connectedUserToken[api_token] + ", "
                      + name + ", " + scientific_name + ", " + max_height + ", " + ids_reproduction + ", "
                      + ids_soil_type + ", " + ids_soil_ph + ", " + ids_soil_humidity + ", "
                      + ids_sun_exposure + ", " + ids_plant_container + ", " + planting_period + ", "
                      + florering_period + ", " + harvest_period + ", " + fk_id_frozen_tolerance + ", "
                      + fk_id_growth_rate + ", " + growth_duration
                      + ", 1, " + con.escape(new Date()) + ")";

            con.query(query_str)
            .then(result => {
                res.status(200).json({ message: "Success" });
            }).catch(err => { res.status(500).json({ message: "Atlas API encountered a issue", err: query_str }); throw err })
        }
        else
        {
            res.status(402).json({ message: "A request for this plant already exist" });
        }
    }).catch(err => { res.status(500).json({message: "Atlas API encountered a issue"}); throw err })
});

module.exports = router;
