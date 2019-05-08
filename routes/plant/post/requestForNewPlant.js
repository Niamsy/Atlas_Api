const router = require('express').Router();
const nodemailer = require('nodemailer');
const config = require('config');
const hub = require('hub');
const { con } = require('../../../index.js');

router.post('/', async (req, res, next) => {
  const { body } = req;
  const { api_token: apiToken } = req.headers;
  const { sendMail } = req.body;

  if (
    body.name === undefined ||
    body.scientific_name === undefined ||
    body.max_height === undefined ||
    body.ids_reproduction === undefined ||
    body.ids_soil_type === undefined ||
    body.ids_soil_ph === undefined ||
    body.ids_soil_humidity === undefined ||
    body.ids_sun_exposure === undefined ||
    body.ids_plant_container === undefined ||
    body.planting_period === undefined ||
    body.florering_period === undefined ||
    body.cutting_period === undefined ||
    body.harvest_period === undefined ||
    body.fk_id_frozen_tolerance === undefined ||
    body.fk_id_growth_rate === undefined ||
    body.growth_duration === undefined
  ) {
    res.status(400).json({ message: 'Body values are incorrect' });
    return;
  }

  const name = con.escape(body.name);
  const scientificName = con.escape(body.scientific_name);
  const maxHeight = body.max_height;
  const idsReproduction = con.escape(body.ids_reproduction);
  const idsSoilType = con.escape(body.ids_soil_type);
  const idsSoilPh = con.escape(body.ids_soil_ph);
  const idsSoilHumidity = con.escape(body.ids_soil_humidity);
  const idsSunExposure = con.escape(body.ids_sun_exposure);
  const idsPlantContainer = con.escape(body.ids_plant_container);
  const plantingPeriod = con.escape(body.planting_period);
  const floreringPeriod = con.escape(body.florering_period);
  const cuttingPeriod = con.escape(body.cutting_period);
  const harvestPeriod = con.escape(body.harvest_period);
  const fkIdFrozenTolerance = body.fk_id_frozen_tolerance;
  const fkIdGrowthRate = body.fk_id_growth_rate;
  const growthDuration = body.growth_duration;

  try {
    let result = await con.query(
      `SELECT name, email from users where id = ${hub.connectedUserToken[apiToken]}`
    );
    const user = result[0][0];

    result = await con.query(
      `SELECT scientific_name from plants WHERE scientific_name = ${scientificName}`
    );
    if (result[0].length) {
      res.status(402).json({ message: 'A plant with the given name already exist' });
      return;
    }
    const creationResult = await con.query(
      `INSERT INTO plant_requests(fk_id_user,
        name, scientific_name, max_height, ids_reproduction, 
        ids_soil_type, ids_soil_ph, ids_soil_humidity, 
        ids_sun_exposure, ids_plant_container, planting_period, cutting_period, 
        florering_period, harvest_period, fk_id_frozen_tolerance, 
        fk_id_growth_rate, growth_duration, status, created_at)
      VALUES (
        ${hub.connectedUserToken[apiToken]}, 
        ${name}, 
        ${scientificName}, 
        ${maxHeight}, 
        ${idsReproduction}, 
        ${idsSoilType}, 
        ${idsSoilPh}, 
        ${idsSoilHumidity}, 
        ${idsSunExposure}, 
        ${idsPlantContainer}, 
        ${plantingPeriod}, 
        ${cuttingPeriod}, 
        ${floreringPeriod}, 
        ${harvestPeriod}, 
        ${fkIdFrozenTolerance}, 
        ${fkIdGrowthRate}, 
        ${growthDuration}, 1, 
        ${con.escape(new Date())}
      )`
    );
    result = await con.query('SELECT email FROM users WHERE users.right_id = 1');
    const mailList = [];

    result[0].forEach(key => {
      mailList.push(key.email);
    });

    const smtpTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.email,
        pass: config.password_gmail
      }
    });

    let errorMail = false;
    if (sendMail !== false) {
      mailList.forEach(to => {
        const msg = {
          from: config.email,
          subject: 'New plant request ✔',
          html:
            `${'<b>Hello ! ✔</b></br> There is a new plant request from '}${user.name} - ${
              user.email
            }(ID: ${creationResult[0]})` +
            `<br >Value of the plant requested: ` +
            `<br >   <b>Name</b>                    :   ${name}<br >   <b>Scientific name</b>         :   ${scientificName}<br >   <b>Max height</b>              :   ${maxHeight}<br >   <b>IDs of the soil PH</b>      :   ${idsSoilPh}<br >   <b>IDs of soil type</b>        :   ${idsSoilType}<br >   <b>IDs of sun exposure</b>     :   ${idsSunExposure}<br >   <b>IDs of soil humidity</b>    :   ${idsSoilHumidity}<br >   <b>IDs of reproduction</b>     :   ${idsReproduction}<br >   <b>IDs of plant container</b>   :   ${idsPlantContainer}<br >   <b>Planting period</b>         :   ${plantingPeriod}<br >   <b>Florering period</b>        :   ${floreringPeriod}<br >   <b>Harvest period</b>          :   ${harvestPeriod}<br >   <b>Cutting period</b>          :   ${cuttingPeriod}<br >   <b>ID frozen tolerance</b>     :   ${fkIdFrozenTolerance}<br >   <b>ID growth rate</b>          :   ${fkIdGrowthRate}`
        };
        msg.to = to;

        smtpTransport.sendMail(msg, err => {
          if (err) errorMail = true;
        });
      });
    }
    smtpTransport.close();
    if (errorMail)
      res.status(201).json({
        message: 'Error while sending mails to admins',
        request_id: creationResult[0]
      });
    else res.status(200).json({ message: 'Success', request_id: creationResult[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
