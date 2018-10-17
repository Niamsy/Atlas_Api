const router = require('express').Router();
const hub = require('hub');
const { con } = require('../../../index.js');

const plantInfo = require('../../PlantInfo/functions_PlantInfo.js');

router.get('/', async (req, res, next) => {
  const { api_token } = req.headers;

  try {
    const result = await con.query(
      `SELECT plants.name, plants.scientific_name, plants.maxheight, plants.ids_reproduction,
        plants.ids_soil_type, plants.ids_soil_ph, plants.ids_soil_humidity, 
        plants.ids_sun_exposure, plants.ids_plant_container, plants.planting_period, plants.florering_period, 
        plants.harvest_period, plants.harvest_period, plants.cutting_period, plants.fk_id_frozen_tolerance, 
        plants.fk_id_growth_rate, growth_duration
      FROM plants INNER JOIN users_plants ON plants.id=users_plants.fk_id_plant 
        where fk_id_user=${hub.connectedUserToken[api_token]} GROUP BY plants.name`
    );
    const returnValue = result[0];
    if (returnValue.length > 0) {
      for (let i = 0; i < returnValue.length; i += 1) {
        returnValue[i].soilType = plantInfo.transformSoilTypeToValue(returnValue[i].ids_soil_type);
        returnValue[i].soilHumidity = plantInfo.transformSoilHumidityToValue(
          returnValue[i].ids_soil_humidity
        );
        returnValue[i].soilPH = plantInfo.transformSoilPHToValue(returnValue[i].ids_soil_ph);
        returnValue[i].sunExposure = plantInfo.transformSunExposureToValue(
          returnValue[i].ids_sun_exposure
        );
        returnValue[i].reproduction = plantInfo.transformReproductionToValue(
          returnValue[i].ids_reproduction
        );
      }
      return res.status(200).json(returnValue);
    }
    return res.status(404).json({ message: 'Not found' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
