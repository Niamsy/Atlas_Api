const router = require('express').Router();
const { con } = require('../../../index.js');

router.get('/', async (req, res, next) => {
  const { plant_id: plantId } = req.headers;

  if (!plantId) {
    return res.status(400).json({ message: 'Header values are incorrect.' });
  }
  try {
    const result = await con.query(
      `SELECT name, scientific_name, maxheight, ids_reproduction, ids_soil_type, ids_soil_ph,
          plants.ids_soil_humidity, ids_sun_exposure, ids_plant_container, planting_period,
          florering_period, harvest_period, harvest_period, cutting_period, fk_id_frozen_tolerance,
          fk_id_growth_rate, growth_duration FROM plants where id=${plantId}`
    );
    if (result[0].length <= 0) {
      return res.status(404).json({ message: "The plant requested doesn't exist" });
    }
    return res.status(200).json(result[0][0]);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
