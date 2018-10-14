const router = require('express').Router();
const nodemailer = require('nodemailer');
const config = require('config');
const con = require('../../../index.js').con;

function SendMail(email, request_value, accepted, res) {
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
      `Your request (ID: ${request_value.id}) was ${
        accepted ? 'accepted' : 'declined'
      }<br >Value of the plant requested: ` +
      `<br >   <b>Name</b>                    :   ${
        request_value.name
      }<br >   <b>Scientific name</b>         :   ${
        request_value.scientific_name
      }<br >   <b>Max height</b>              :   ${
        request_value.max_height
      }<br >   <b>IDs of the soil PH</b>      :   ${
        request_value.ids_soil_ph
      }<br >   <b>IDs of soil type</b>        :   ${
        request_value.ids_soil_type
      }<br >   <b>IDs of sun exposure</b>     :   ${
        request_value.ids_sun_exposure
      }<br >   <b>IDs of soil humidity</b>    :   ${
        request_value.ids_soil_humidity
      }<br >   <b>IDs of reproduction</b>     :   ${
        request_value.ids_reproduction
      }<br >   <b>IDs of plant containe</b> r :   ${
        request_value.ids_plant_container
      }<br >   <b>Planting period</b>         :   ${
        request_value.planting_period
      }<br >   <b>Florering period</b>        :   ${
        request_value.florering_period
      }<br >   <b>Harvest period</b>          :   ${
        request_value.harvest_period
      }<br >   <b>Cutting period</b>          :   ${
        request_value.cutting_period
      }<br >   <b>ID frozen tolerance</b>     :   ${
        request_value.fk_id_frozen_tolerance
      }<br >   <b>ID growth rate</b>          :   ${request_value.fk_id_growth_rate}`
  };

  smtpTransport.sendMail(mail, error => {
    if (error) res.status(201).json({ message: 'Error while sending the mail' });
    else res.status(200).json({ message: 'Success' });
    smtpTransport.close();
  });
}

router.post('/', (req, res) => {
  const { id_request, status, sendMail } = req.body;

  if (id_request === undefined || status === undefined) {
    return res.status(400).json({ message: 'Body values are incorrect' });
  }

  // TODO async/await could be nice here, can avoid the chaining .catch and the indentation of hell
  con
    .query(
      `SELECT users.email, plant_requests.* FROM plant_requests INNER JOIN users ON users.id = plant_requests.fk_id_user WHERE plant_requests.id = ${con.escape(
        id_request
      )}`
    )
    .then(request => {
      if (request[0].length === 0) {
        return res.status(403).json({ message: 'No request with the given request_id exists' });
      }
      if (request[0][0].status === '1') {
        const email = request[0][0].email;

        const new_status = status === true ? 2 : 3;
        con
          .query(`UPDATE plant_requests SET status = ${new_status} WHERE id = ${id_request}`)
          .then(() => {
            const request_value = request[0][0];
            if (status === true) {
              const str_query = `INSERT INTO plants
               ${'(name, scientific_name, maxheight, ids_soil_ph, ids_soil_type, ids_sun_exposure, ' +
                 'ids_soil_humidity, ids_reproduction, ids_plant_container, planting_period, ' +
                 'florering_period, harvest_period, cutting_period, fk_id_frozen_tolerance, ' +
                 'fk_id_growth_rate, growth_duration) ' +
                 ' VALUES ('}${con.escape(request_value.name)}, ${con.escape(
                request_value.scientific_name
              )}, ${request_value.max_height}, ${con.escape(
                request_value.ids_soil_ph
              )}, ${con.escape(request_value.ids_soil_type)}, ${con.escape(
                request_value.ids_sun_exposure
              )}, ${con.escape(request_value.ids_soil_humidity)}, ${con.escape(
                request_value.ids_reproduction
              )}, ${con.escape(request_value.ids_plant_container)}, ${con.escape(
                request_value.planting_period
              )}, ${con.escape(request_value.florering_period)}, ${con.escape(
                request_value.harvest_period
              )}, ${con.escape(request_value.cutting_period)}, ${
                request_value.fk_id_frozen_tolerance
              }, ${request_value.fk_id_growth_rate}, ${request_value.growth_duration});`;
              con
                .query(str_query)
                .then(() => {
                  if (sendMail === false) {
                    return res.status(200).json({ message: 'Success' });
                  }
                  SendMail(email, request_value, true, res);
                })
                .catch(() => res.status(500).json({ message: 'Atlas API Encountered a issue' }));
            } else if (sendMail === false) {
              return res.status(200).json({ message: 'Success' });
            } else {
              SendMail(email, request_value, false, res);
            }
          })
          .catch(() => {
            res.status(500).json({ message: 'Atlas API encountered a issue' });
          });
      } else {
        res.status(404).json({ message: 'The given request have already been treated' });
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'Atlas API encountered a issue' });
    });
});

module.exports = router;
