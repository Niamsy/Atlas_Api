const router = require('express').Router();
const { con } = require('../../../index.js');

router.get('/', async (req, res, next) => {
  try {
    const finalResult = await con.query(
      'SELECT id, created_at, name, scientific_name, max_height, ' +
        ' ids_soil_ph, ids_soil_type, ids_sun_exposure, ids_soil_humidity,' +
        ' ids_reproduction, ids_plant_container, planting_period, florering_period,' +
        ' harvest_period, cutting_period,' +
        ' fk_id_frozen_tolerance, fk_id_growth_rate' +
        ' FROM plant_requests WHERE status = 1'
    );
    res.status(200).json({ requests: finalResult[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
