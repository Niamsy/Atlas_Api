const router = require('express').Router();
const con = require('../../../index.js').con;
const hub = require('hub');


router.get('/', (req, res) => {
  const { api_token } = req.headers;

  con.query(`SELECT plants.name, plants.scientific_name, plants.maxheight, plants.ids_reproduction,
    plants.ids_soil_type, plants.ids_soil_ph, plants.ids_soil_humidity, 
    plants.ids_sun_exposure, plants.ids_plant_container, plants.planting_period, plants.florering_period, 
    plants.harvest_period, plants.harvest_period, plants.cutting_period, plants.fk_id_frozen_tolerance, 
    plants.fk_id_growth_rate, growth_duration FROM plants INNER JOIN users_plants ON plants.id=users_plants.fk_id_plant 
    where fk_id_user=${hub.connectedUserToken[api_token]} GROUP BY plants.name`)
    .then(result => {
      if (result[0].length > 0) {
        res.status(200).json(result[0]);
      } else {
        res.status(500).json({message: "Internal server error"});
      }
    }).catch(() => {
    return res.status(500).json({message: "Internal server error"});
  })
});

module.exports = router;
