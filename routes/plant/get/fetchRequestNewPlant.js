const router = require('express').Router();
const con = require('../../../index.js').con;

let hub = require('hub');

router.get('/', (req, res) => {
  const token = req.header('api_token');

  if (token === null) {
    res.status(400).json({message: "Header values are incorrect"});
  } else if (hub.connectedUserToken[token] === undefined) {
    res.status(401).json({message: "API token is wrong"});
  } else {
    const id = hub.connectedUserToken[token];
    con.query("SELECT id, created_at, name, scientific_name, max_height, "
      + " ids_soil_ph, ids_soil_type, ids_sun_exposure, ids_soil_humidity,"
      + " ids_reproduction, ids_plant_container, planting_period, florering_period,"
      + " harvest_period, cutting_period,"
      + " fk_id_frozen_tolerance, fk_id_growth_rate"
      + " FROM plant_requests WHERE fk_id_user = " + id)
      .then(result => {
        res.status(200).json(result[0]);
      }).catch(err => {
        res.status(500).json({message: "API encountered an issue: +" + err});
      })
  }
});

module.exports = router;
