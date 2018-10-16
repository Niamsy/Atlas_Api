const router = require('express').Router();
const hub = require('hub');
const { con } = require('../../../index.js');

router.post('/', async (req, res, next) => {
  const { api_token } = req.headers;
  const { scientific_name: plantName } = req.body;

  if (plantName === undefined) {
    return res.status(400).json({ message: 'Header values are incorrect.' });
  }
  try {
    const result = await con.query(`SELECT *
              from plants where scientific_name = ${con.escape(plantName)}`);
    if (result[0].length > 0) {
      const plant_id = result[0].id;
      const date = new Date();
      await con.query(
        `INSERT INTO users_plants (fk_id_user, fk_id_plant, scanned_at)
              VALUES (
                ${hub.connectedUserToken[api_token]},
                ${plant_id},
                ${con.escape(date)}
              )`
      );
      return res.status(200).json({ message: 'Success' });
    }
    return res.status(404).json({ message: 'Plant not found' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
