const router = require('express').Router();
const hub = require('hub');
const con = require('../../../index.js').con;

router.get('/', (req, res) => {
  const { api_token: token } = req.headers;

  con
    .query(
      `SELECT plants.id, scanned_at FROM plants
        INNER JOIN users_plants ON plants.id=users_plants.fk_id_plant
        WHERE fk_id_user=${hub.connectedUserToken[token]}`
    )
    .then(result => {
      res.status(200).json(result[0]);
    })
    .catch(err => {
      res.status(500).json({ message: 'Api encountered an issue: +' + err });
    });
});

module.exports = router;
