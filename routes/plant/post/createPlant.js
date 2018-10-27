const router = require('express').Router();
const { con } = require('../../../index.js');

router.post('/', async (req, res, next) => {
  const {
    name,
    scientific_name: scientificName,
    max_height: maxHeight,
    ids_soil_ph: idsSoilPh,
    ids_soil_type: idsSoilType,
    ids_sun_exposure: idsSunExposure,
    ids_soil_humidity: idsSoilHumidity,
    ids_reproduction: idsReproduction,
    ids_plant_container: idsPlantContainer,
    planting_period: plantingPeriod,
    florering_period: floreringPeriod,
    harvest_period: harvestPeriod,
    cutting_period: cuttingPeriod,
    fk_id_frozen_tolerance: fkIdFrozenTolerance,
    fk_id_growth_rate: fkIdGrowthRate,
    growth_duration: growthDuration
  } = req.body;

  if (
    name === undefined ||
    scientificName === undefined ||
    maxHeight === undefined ||
    idsSoilPh === undefined ||
    idsSoilType === undefined ||
    idsSunExposure === undefined ||
    idsSoilHumidity === undefined ||
    idsReproduction === undefined ||
    idsPlantContainer === undefined ||
    plantingPeriod === undefined ||
    floreringPeriod === undefined ||
    harvestPeriod === undefined ||
    cuttingPeriod === undefined ||
    fkIdFrozenTolerance === undefined ||
    fkIdGrowthRate === undefined ||
    growthDuration === undefined
  ) {
    return res.status(400).json({ message: 'Body values are incorrect' });
  }
  try {
    const result = await con.query(
      `SELECT id from plants where scientific_name = ${con.escape(scientificName)}`
    );
    if (result[0].length === 0) {
      await con.query(`INSERT INTO plants 
            (name, scientific_name, maxheight, ids_soil_ph, ids_soil_type, ids_sun_exposure, 
            ids_soil_humidity, ids_reproduction, ids_plant_container, planting_period, 
            florering_period, harvest_period, cutting_period, fk_id_frozen_tolerance, 
            fk_id_growth_rate, growth_duration) 
             VALUES (
              ${con.escape(name)}, ${con.escape(scientificName)}, ${maxHeight}, 
              ${con.escape(idsSoilPh)}, ${con.escape(idsSoilType)}, 
              ${con.escape(idsSunExposure)}, 
              ${con.escape(idsSoilHumidity)}, ${con.escape(idsReproduction)},
              ${con.escape(idsPlantContainer)}, ${con.escape(plantingPeriod)},
              ${con.escape(floreringPeriod)}, ${con.escape(harvestPeriod)},
              ${con.escape(cuttingPeriod)}, ${fkIdFrozenTolerance}, ${fkIdGrowthRate}, 
              ${growthDuration}
            );
          `);
      return res.status(201).json({ message: 'Plant created' });
    }
    return res.status(403).json({ message: 'Plant already exist' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
