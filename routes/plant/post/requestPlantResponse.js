const router = require('express').Router();
const nodemailer = require('nodemailer');
const config = require('config');
const { con } = require('../../../index.js');

// TODO need deep rework here too
function SendMail(email, requestValue, accepted, res) {
  const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.email,
      pass: config.password_gmail
    }
  });

  const mail = {
    from: config.email,
    to: email,
    subject: 'Response to your request',
    html:
      `Your request (ID: ${requestValue.id}) was ${
        accepted ? 'accepted' : 'declined'
      }<br >Value of the plant requested: ` +
      `<br >   <b>Name</b>                    :   ${requestValue.name}<br >   <b>Scientific name</b>         :   ${requestValue.scientific_name}<br >   <b>Max height</b>              :   ${requestValue.max_height}<br >   <b>IDs of the soil PH</b>      :   ${requestValue.ids_soil_ph}<br >   <b>IDs of soil type</b>        :   ${requestValue.ids_soil_type}<br >   <b>IDs of sun exposure</b>     :   ${requestValue.ids_sun_exposure}<br >   <b>IDs of soil humidity</b>    :   ${requestValue.ids_soil_humidity}<br >   <b>IDs of reproduction</b>     :   ${requestValue.ids_reproduction}<br >   <b>IDs of plant containe</b> r :   ${requestValue.ids_plant_container}<br >   <b>Planting period</b>         :   ${requestValue.planting_period}<br >   <b>Florering period</b>        :   ${requestValue.florering_period}<br >   <b>Harvest period</b>          :   ${requestValue.harvest_period}<br >   <b>Cutting period</b>          :   ${requestValue.cutting_period}<br >   <b>ID frozen tolerance</b>     :   ${requestValue.fk_id_frozen_tolerance}<br >   <b>ID growth rate</b>          :   ${requestValue.fk_id_growth_rate}`
  };

  smtpTransport.sendMail(mail, error => {
    if (error) res.status(201).json({ message: 'Error while sending the mail' });
    else res.status(200).json({ message: 'Success' });
    smtpTransport.close();
  });
}

router.post('/', async (req, res, next) => {
  const { id_request: idRequest, status, sendMail } = req.body;

  if (idRequest === undefined || status === undefined) {
    return res.status(400).json({ message: 'Body values are incorrect' });
  }

  try {
    const request = await con.query(
      `SELECT users.email, plant_requests.*
       FROM plant_requests
              INNER JOIN users ON users.id = plant_requests.fk_id_user
        WHERE plant_requests.id = ${con.escape(idRequest)}`
    );
    if (request[0].length === 0) {
      return res.status(403).json({ message: 'No request with the given request_id exists' });
    }
    if (request[0][0].status === '1') {
      const { email } = request[0][0];

      const newStatus = status === true ? 2 : 3;
      await con.query(`UPDATE plant_requests SET status = ${newStatus} WHERE id = ${idRequest}`);
      const requestValue = request[0][0];
      if (status === true) {
        await con.query(
          `INSERT INTO plants
              (name, scientific_name, maxheight, ids_soil_ph, ids_soil_type, ids_sun_exposure, 
                 ids_soil_humidity, ids_reproduction, ids_plant_container, planting_period, 
                 florering_period, harvest_period, cutting_period, fk_id_frozen_tolerance,
                 fk_id_growth_rate, growth_duration)
                  VALUES (${con.escape(requestValue.name)}, ${con.escape(
            requestValue.scientific_name
          )}, ${requestValue.max_height}, ${con.escape(requestValue.ids_soil_ph)}, ${con.escape(
            requestValue.ids_soil_type
          )}, ${con.escape(requestValue.ids_sun_exposure)}, ${con.escape(
            requestValue.ids_soil_humidity
          )}, ${con.escape(requestValue.ids_reproduction)}, ${con.escape(
            requestValue.ids_plant_container
          )}, ${con.escape(requestValue.planting_period)}, ${con.escape(
            requestValue.florering_period
          )}, ${con.escape(requestValue.harvest_period)}, ${con.escape(
            requestValue.cutting_period
          )}, ${requestValue.fk_id_frozen_tolerance}, ${requestValue.fk_id_growth_rate}, ${
            requestValue.growth_duration
          });`
        );
        // TODO better way to handle this case
        if (sendMail === false) {
          return res.status(200).json({ message: 'Success' });
        }
        SendMail(email, requestValue, true, res);
      } else if (sendMail === false) {
        return res.status(200).json({ message: 'Success' });
      } else {
        return SendMail(email, requestValue, false, res);
      }
    } else {
      return res.status(404).json({ message: 'The given request have already been treated' });
    }
  } catch (err) {
    return next(err);
  }
  return true;
});

module.exports = router;
