const router = require('express').Router();
const hub = require('hub');
const { con } = require('../../../index.js');

router.get('/', (req, res) => {
  const { api_token: token } = req.headers;

  const id = hub.connectedUserToken[token];
  con
    .query(
      `${'SELECT id, created_at, name, scientific_name, max_height, ' +
        ' ids_soil_ph, ids_soil_type, ids_sun_exposure, ids_soil_humidity,' +
        ' ids_reproduction, ids_plant_container, planting_period, florering_period,' +
        ' harvest_period, cutting_period,' +
        ' fk_id_frozen_tolerance, fk_id_growth_rate' +
        ' FROM plant_requests WHERE fk_id_user = '}${id}`
    )
    .then(result => {
      res.status(200).json({ requests: result[0] });
    })
    .catch(err => {
      res.status(500).json({ message: `API encountered an issue: +${err}` });
    });
});

module.exports = router;
