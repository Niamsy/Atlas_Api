const router = require('express').Router();
const con = require('../../../index.js').con;
const hub = require('hub');

router.post('/', (req, res) => {
  const token = req.header('api_token');

  if (req.body["name"] === undefined || req.body["scientific_name"] === undefined
    || req.body["max_height"] === undefined || req.body["ids_soil_ph"] === undefined
    || req.body["ids_soil_type"] === undefined || req.body["ids_sun_exposure"] === undefined
    || req.body["ids_soil_humidity"] === undefined || req.body["ids_reproduction"] === undefined
    || req.body["ids_plant_container"] === undefined || req.body["planting_period"] === undefined
    || req.body["florering_period"] === undefined || req.body["harvest_period"] === undefined
    || req.body["cutting_period"] === undefined || req.body["fk_id_frozen_tolerance"] === undefined
    || req.body["fk_id_growth_rate"] === undefined || req.body["growth_duration"] === undefined) {
    res.status(400).json({message: "Body values are incorrect"});
  } else if (token === undefined || hub.connectedUserToken[token] === undefined) {
    res.status(401).json({message: "API token is invalid"});
  } else {
    con.query("SELECT rights.name FROM rights INNER JOIN users ON users.right_id = rights.id WHERE users.id = '"
      + hub.connectedUserToken[token] + "'").then(result => {
      if (result[0].length === 0 || result[0][0]['name'] !== "admin") {
        return res.status(402).json({message: "The API Token doesn't belong to a admin", result: result[0]});
      }
      con.query("SELECT id from plants where scientific_name = " + con.escape(req.body["scientific_name"])).then(result => {
        if (result[0].length === 0) {
          const str_query = "INSERT INTO plants "
            + "(name, scientific_name, maxheight, ids_soil_ph, ids_soil_type, ids_sun_exposure, "
            + "ids_soil_humidity, ids_reproduction, ids_plant_container, planting_period, "
            + "florering_period, harvest_period, cutting_period, fk_id_frozen_tolerance, "
            + "fk_id_growth_rate, growth_duration) " + " VALUES (" + con.escape(req.body["name"])
            + ", " + con.escape(req.body["scientific_name"]) + ", " + (req.body["max_height"])
            + ", " + con.escape(req.body["ids_soil_ph"]) + ", " + con.escape(req.body["ids_soil_type"])
            + ", " + con.escape(req.body["ids_sun_exposure"]) + ", " + con.escape(req.body["ids_soil_humidity"])
            + ", " + con.escape(req.body["ids_reproduction"]) + ", " + con.escape(req.body["ids_plant_container"])
            + ", " + con.escape(req.body["planting_period"]) + ", " + con.escape(req.body["florering_period"])
            + ", " + con.escape(req.body["harvest_period"]) + ", " + con.escape(req.body["cutting_period"])
            + ", " + (req.body["fk_id_frozen_tolerance"]) + ", " + (req.body["fk_id_growth_rate"])
            + ", " + (req.body["growth_duration"]) + ");";
          con.query(str_query).then(() => {
            return res.status(201).json({message: "Plant created"});
          }).catch(() => res.status(500).json({message: "Atlas API Encountered a issue"}));
        } else {
          res.status(403).json({message: "Plant already exist"});
        }
      }).catch(() => res.status(500).json({message: "Atlas API Encountered a issue."}));
    }).catch(() => res.status(500).json({message: "Atlas API Encountered a issue."}));
  }
});

module.exports = router;
