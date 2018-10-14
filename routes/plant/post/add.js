const router = require('express').Router();
const hub = require('hub');
const { con } = require('../../../index.js');

router.post('/', (req, res) => {
  const { api_token } = req.headers;
  const { scientific_name: plantName } = req.body;

  if (plantName == null) {
    return res.status(400).json({ message: 'Header values are incorrect.' });
  }
  con
    .query(`SELECT * from plants where scientific_name = ${con.escape(plantName)}`)
    .then(result => {
      if (result[0].length > 0) {
        const plant_id = result[0].id;
        const date = new Date();
        con
          .query(
            `INSERT INTO users_plants (fk_id_user, fk_id_plant, scanned_at)
              VALUES (
                ${hub.connectedUserToken[api_token]},
                ${plant_id},
                ${con.escape(date)}
              )`
          )
          .then(() => res.status(200).json({ message: 'Success' }))
          .catch(err => res.status(500).json({ message: `Api encountered an issue: ${err}` }));
      } else {
        return res.status(404).json({ message: 'Plant not found' });
      }
    })
    .catch(err => res.status(500).json({ message: `Api encountered an issue: ${err}` }));
});

module.exports = router;
