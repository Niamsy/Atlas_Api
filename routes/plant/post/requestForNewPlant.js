const router = require('express').Router();
const con = require('../../../index.js').con;
const hub = require('hub');

router.post('/', (req, res) => {
  const body = req.body;
  const { api_token } = req.headers;

  if (body["name"] === undefined || body["scientific_name"] === undefined || body["max_height"] === undefined
    || body["ids_reproduction"] === undefined || body["ids_soil_type"] === undefined || body["ids_soil_ph"] === undefined
    || body["ids_soil_humidity"] === undefined || body["ids_sun_exposure"] === undefined || body["ids_plant_container"] === undefined
    || body["planting_period"] === undefined || body["florering_period"] === undefined || body["harvest_period"] === undefined
    || body["fk_id_frozen_tolerance"] === undefined || body["fk_id_growth_rate"] === undefined || body["growth_duration"] === undefined) {
    return res.status(400).json({message: "Body values are incorrect"});
  }
  const name = con.escape(body["name"]);
  const scientific_name = con.escape(body["scientific_name"]);
  const max_height = body["max_height"];
  const ids_reproduction = con.escape(body["ids_reproduction"]);
  const ids_soil_type = con.escape(body["ids_soil_type"]);
  const ids_soil_ph = con.escape(body["ids_soil_ph"]);
  const ids_soil_humidity = con.escape(body["ids_soil_humidity"]);
  const ids_sun_exposure = con.escape(body["ids_sun_exposure"]);
  const ids_plant_container = con.escape(body["ids_plant_container"]);
  const planting_period = con.escape(body["planting_period"]);
  const florering_period = con.escape(body["florering_period"]);
  const harvest_period = con.escape(body["harvest_period"]);
  const fk_id_frozen_tolerance = body["fk_id_frozen_tolerance"];
  const fk_id_growth_rate = body["fk_id_growth_rate"];
  const growth_duration = body["growth_duration"];

  const query_str = `INSERT INTO plant_requests(fk_id_user, name, scientific_name, max_height, ids_reproduction,
    ids_soil_type, ids_soil_ph, ids_soil_humidity, ids_sun_exposure, ids_plant_container, planting_period,
    florering_period, harvest_period, fk_id_frozen_tolerance, fk_id_growth_rate, growth_duration,
    status, created_at) VALUES (
    ${hub.connectedUserToken[api_token]}, ${name}, ${scientific_name}, ${max_height}, ${ids_reproduction},
    ${ids_soil_type}, ${ids_soil_ph}, ${ids_soil_humidity}, ${ids_sun_exposure}, ${ids_plant_container}, ${planting_period},
    ${florering_period}, ${harvest_period}, ${fk_id_frozen_tolerance}, ${fk_id_growth_rate}, ${growth_duration}
    , 1, ${con.escape(new Date())})`;

  con.query(query_str)
    .then(() => {
      return res.status(200).json({message: "Success"});
    }).catch(() => {
      return res.status(500).json({message: "Atlas API encountered a issue", err: query_str});
    })
});

module.exports = router;
