const router = require('express').Router();
const nodemailer = require('nodemailer');
const config = require('config');
const hub = require('hub');
const { con } = require('../../../index.js');

// TODO: ugly function, need deep refactor
router.post('/', async (req, res, next) => {
  const { body } = req;
  const { api_token } = req.headers;
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
    return res.status(400).json({ message: 'Body values are incorrect' });
  }

  const name = con.escape(body.name);
  const scientific_name = con.escape(body.scientific_name);
  const max_height = body.max_height;
  const ids_reproduction = con.escape(body.ids_reproduction);
  const ids_soil_type = con.escape(body.ids_soil_type);
  const ids_soil_ph = con.escape(body.ids_soil_ph);
  const ids_soil_humidity = con.escape(body.ids_soil_humidity);
  const ids_sun_exposure = con.escape(body.ids_sun_exposure);
  const ids_plant_container = con.escape(body.ids_plant_container);
  const planting_period = con.escape(body.planting_period);
  const florering_period = con.escape(body.florering_period);
  const cutting_period = con.escape(body.cutting_period);
  const harvest_period = con.escape(body.harvest_period);
  const fk_id_frozen_tolerance = body.fk_id_frozen_tolerance;
  const fk_id_growth_rate = body.fk_id_growth_rate;
  const growth_duration = body.growth_duration;

  try {
    let result = await con.query(
      `SELECT name, email from users where id = ${hub.connectedUserToken[api_token]}`
    );
    const user = result[0][0];

    const creationResult = await con.query(
      `INSERT INTO plant_requests(fk_id_user,
        name, scientific_name, max_height, ids_reproduction, 
        ids_soil_type, ids_soil_ph, ids_soil_humidity, 
        ids_sun_exposure, ids_plant_container, planting_period, cutting_period, 
        florering_period, harvest_period, fk_id_frozen_tolerance, 
        fk_id_growth_rate, growth_duration, status, created_at)
      VALUES (
        ${hub.connectedUserToken[api_token]}, 
        ${name}, 
        ${scientific_name}, 
        ${max_height}, 
        ${ids_reproduction}, 
        ${ids_soil_type}, 
        ${ids_soil_ph}, 
        ${ids_soil_humidity}, 
        ${ids_sun_exposure}, 
        ${ids_plant_container}, 
        ${planting_period}, 
        ${cutting_period}, 
        ${florering_period}, 
        ${harvest_period}, 
        ${fk_id_frozen_tolerance}, 
        ${fk_id_growth_rate}, 
        ${growth_duration}, 1, 
        ${con.escape(new Date())}
      )`
    );
    result = await con.query('SELECT email from users where users.right_id = 1');
    const mailList = [];
    for (const key in result[0]) {
      mailList.push(result[0][key].email);
    }

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
            `${'<b>Hello ! ✔</b></br>' + 'There is a new plant request from '}${user.name} - ${
              user.email
            }(ID: ${creationResult[0]})` +
            `<br >Value of the plant requested: ` +
            `<br >   <b>Name</b>                    :   ${name}<br >   <b>Scientific name</b>         :   ${scientific_name}<br >   <b>Max height</b>              :   ${max_height}<br >   <b>IDs of the soil PH</b>      :   ${ids_soil_ph}<br >   <b>IDs of soil type</b>        :   ${ids_soil_type}<br >   <b>IDs of sun exposure</b>     :   ${ids_sun_exposure}<br >   <b>IDs of soil humidity</b>    :   ${ids_soil_humidity}<br >   <b>IDs of reproduction</b>     :   ${ids_reproduction}<br >   <b>IDs of plant container</b>   :   ${ids_plant_container}<br >   <b>Planting period</b>         :   ${planting_period}<br >   <b>Florering period</b>        :   ${florering_period}<br >   <b>Harvest period</b>          :   ${harvest_period}<br >   <b>Cutting period</b>          :   ${cutting_period}<br >   <b>ID frozen tolerance</b>     :   ${fk_id_frozen_tolerance}<br >   <b>ID growth rate</b>          :   ${fk_id_growth_rate}`
        };
        msg.to = to;

        smtpTransport.sendMail(msg, err => {
          if (err) errorMail = true;
        });
      });
    }
    smtpTransport.close();
    return errorMail
      ? res.status(201).json({
          message: 'Error while sending mails to admins',
          request_id: creationResult[0]
        })
      : res.status(200).json({ message: 'Success', request_id: creationResult[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
