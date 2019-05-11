const router = require('express').Router();
const hub = require('hub');
const { con } = require('../../../index.js');

router.post('/', async (req, res, next) => {
  const { api_token: apiToken } = req.headers;
  const { scientific_name: plantName } = req.body;

  if (plantName === undefined) {
    res.status(400).json({ message: 'Header values are incorrect.' });
    return;
  }
  try {
    const result = await con.query(`SELECT * from plants where scientific_name = ${con.escape(plantName)}`);
    console.log(result);
    if (result[0].length > 0) {
      console.log(result[0]);
      const plantId = result[0].id;
      console.log(plantId);
      const date = new Date();
      console.log(data);
      await con.query(
        `INSERT INTO users_plants (fk_id_user, fk_id_plant, scanned_at)
              VALUES (
                ${hub.connectedUserToken[apiToken]},
                ${plantId},
                ${con.escape(date)}
              )`
      );
      res.status(200).json({ message: 'Success' });
      return;
    }
    res.status(404).json({ message: 'Plant not found' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
