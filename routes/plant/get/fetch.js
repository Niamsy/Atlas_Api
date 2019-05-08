const router = require('express').Router();
const hub = require('hub');
const { con } = require('../../../index.js');

router.get('/', async (req, res, next) => {
  const { api_token: token } = req.headers;

  try {
    const result = await con.query(
      `${'SELECT plants.id, plants.name, plants.scientific_name, plants.maxheight, plants.ids_reproduction, plants.ids_soil_type, plants.ids_soil_ph, plants.ids_soil_humidity, ' +
        'plants.ids_sun_exposure, plants.ids_plant_container, plants.planting_period, plants.florering_period, ' +
        'plants.harvest_period, plants.harvest_period, plants.cutting_period, plants.fk_id_frozen_tolerance,' +
        ' plants.fk_id_growth_rate, scanned_at, growth_duration FROM plants INNER JOIN users_plants ON plants.id=users_plants.fk_id_plant' +
        ' where fk_id_user='}${hub.connectedUserToken[token]}`
    );
    res.status(200).json(result[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
