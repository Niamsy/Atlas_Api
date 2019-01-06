const router = require('express').Router();
const { con } = require('../../../index.js');

router.get('/', (req, res, next) => {
  if (req.params.name === undefined) {
    res.status(400).json({ message: 'Need all value in header' });
    return;
  }
  const name = req.params.name.split('-').join(' ');

  con
    .query(`SELECT * from plants where scientific_name = '${name}'`)
    .then(result => {
      if (result[0].length > 0) {
        res.send('yes');
      } else {
        res.send('no');
      }
    })
    .catch(err => next(err));
});

module.exports = router;
