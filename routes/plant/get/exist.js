const router = require('express').Router();
const { con } = require('../../../index.js');

router.get('/', (req, res) => {
  if (req.params.name === undefined) {
    res.status(400).json({ message: 'Need all value in header' });
  }
  const name = req.params.name.split('-').join(' ');

  con
    .query(`SELECT * from plants where scientific_name = '${name}'`)
    .then(result => {
      if (result[0].length > 0) {
        return res.send('yes');
      }
      return res.send('no');
    })
    .catch(err => res.status(500).json({ message: `Api encountered an issue: ${err}` }));
});

module.exports = router;
