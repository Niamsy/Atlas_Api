const router = require('express').Router();
const hub = require('hub');
const { con } = require('../../../index.js');

router.get('/', async (req, res, next) => {
  const { api_token: token } = req.headers;

  try {
    const result = await con.query(
      `SELECT plants.id, scanned_at
           FROM plants
                  INNER JOIN users_plants ON plants.id = users_plants.fk_id_plant
          WHERE fk_id_user =${hub.connectedUserToken[token]}`
    );
    res.status(200).json(result[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
