const router = require('express').Router();
const { con } = require('../../../index.js');
const { transformReproductionToValue } = require('../functions_PlantInfo.js');

router.get('/', (req, res) => {
  const { plant_id } = req.headers;

  if (plant_id === undefined) res.status(400).json({ message: 'Header values are incorrect' });
  else {
    con
      .query(`SELECT ids_reproduction FROM plants WHERE id = ${plant_id}`)
      .then(result => {
        if (result[0].length === 0) {
          return res.status(401).json("This plant doesn't exist");
        }
        const ids = result[0][0].ids_reproduction;

        const returnVal = transformReproductionToValue(ids);
        if (returnVal === undefined) {
          res.status(500).json({ message: 'Internal server error' });
        } else {
          res.status(200).json(returnVal);
        }
      })
      .catch(err => {
        res.status(500).json({ message: 'Internal server error' });
        throw err;
      });
  }
});

module.exports = router;
