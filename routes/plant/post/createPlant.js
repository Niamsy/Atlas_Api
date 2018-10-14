const router = require('express').Router();
const con = require('../../../index.js').con;

router.post('/', (req, res) => {
  const {
    name,
    scientific_name,
    max_height,
    ids_soil_ph,
    ids_soil_type,
    ids_sun_exposure,
    ids_soil_humidity,
    ids_reproduction,
    ids_plant_container,
    planting_period,
    florering_period,
    harvest_period,
    cutting_period,
    fk_id_frozen_tolerance,
    fk_id_growth_rate,
    growth_duration
  } = req.body;

  if (
    name === undefined ||
    scientific_name === undefined ||
    max_height === undefined ||
    ids_soil_ph === undefined ||
    ids_soil_type === undefined ||
    ids_sun_exposure === undefined ||
    ids_soil_humidity === undefined ||
    ids_reproduction === undefined ||
    ids_plant_container === undefined ||
    planting_period === undefined ||
    florering_period === undefined ||
    harvest_period === undefined ||
    cutting_period === undefined ||
    fk_id_frozen_tolerance === undefined ||
    fk_id_growth_rate === undefined ||
    growth_duration === undefined
  ) {
    return res.status(400).json({ message: 'Body values are incorrect' });
  }
  con
    .query(`SELECT id from plants where scientific_name = ${con.escape(scientific_name)}`)
    .then(result => {
      if (result[0].length === 0) {
        const str_query = `INSERT INTO plants 
          (name, scientific_name, maxheight, ids_soil_ph, ids_soil_type, ids_sun_exposure, 
          ids_soil_humidity, ids_reproduction, ids_plant_container, planting_period, 
          florering_period, harvest_period, cutting_period, fk_id_frozen_tolerance, 
          fk_id_growth_rate, growth_duration) 
           VALUES (
            ${con.escape(name)}, ${con.escape(scientific_name)}, ${max_height}, 
            ${con.escape(ids_soil_ph)}, ${con.escape(ids_soil_type)}, ${con.escape(
          ids_sun_exposure
        )}, 
            ${con.escape(ids_soil_humidity)}, ${con.escape(ids_reproduction)},
            ${con.escape(ids_plant_container)}, ${con.escape(planting_period)},
            ${con.escape(florering_period)}, ${con.escape(harvest_period)},
            ${con.escape(cutting_period)}, ${fk_id_frozen_tolerance}, ${fk_id_growth_rate}, 
            ${growth_duration}
          );
        `;
        con
          .query(str_query)
          .then(() => {
            return res.status(201).json({ message: 'Plant created' });
          })
          .catch(() => res.status(500).json({ message: 'Atlas API Encountered a issue' }));
      } else {
        return res.status(403).json({ message: 'Plant already exist' });
      }
    })
    .catch(() => res.status(500).json({ message: 'Atlas API Encountered a issue.' }));
});

module.exports = router;
