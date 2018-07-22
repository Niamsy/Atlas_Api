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
      res.status(400).json({message: "Header values are incorrect"});
    } else if (hub.connectedUserToken[b.api_token] == null) {
      res.status(401).json({message: "API token is invalid"});
    } else {
      con.query("INSERT INTO plants VALUES (" + con.escape(b.name) + ", " + con.escape(b.scientific_name)
       + ", " + con.escape(b.maxheight) + ", " + con.escape(b.ids_soil_ph) + ", " + con.escape(b.ids_soil_type)
       + ", " + con.escape(b.ids_sun_exposure) + ", " + con.escape(b.ids_soil_humidity)
       + ", " + con.escape(b.ids_reproduction) + ", " + con.escape(b.ids_plant_container)
       + ", " + con.escape(b.planting_period) + ", " + con.escape(b.florering_period)
       + ", " + con.escape(b.harvest_period) + ", " + con.escape(b.cutting_period)
       + ", " + con.escape(b.fk_id_frozen_tolerance) + ", " + con.escape(b.fk_id_growth_rate) + ")").then(res => {
         res.status(200).json({message: "success!"});
       }).catch(e => res.status(500).json({message: "server error"}));
    }

});

module.exports = router;
